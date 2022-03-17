import { feature_collection, feature_item, Ioptions } from './feature';
import { find_state_data, sleep, get_diff_time } from '../util';
import { village } from '../gamedata';
import { Ivillage, Ibuilding, Ibuilding_queue, Ibuilding_collection, Iresources } from '../interfaces';
import { building_types } from '../data';
import api from '../api';
import logger from '../logger';
import finish_earlier from './finish_earlier';

interface Ioptions_queue extends Ioptions {
	village_name: string
	village_id: number
	queue: Iqueue[]
}

interface Iqueue {
	type: number
	location: number
}

class building_queue extends feature_collection {
	get_ident(): string {
		return 'queue';
	}

	get_new_item(options: Ioptions_queue): queue {
		return new queue({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_queue {
		return {
			...options,
			village_name: '',
			village_id: 0,
			queue: []
		};
	}
}

class queue extends feature_item {
	options: Ioptions_queue;

	set_options(options: Ioptions_queue): void {
		const { uuid, run, error, village_name, village_id, queue } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			village_id,
			queue: [ ...queue ]
		};
	}

	get_options(): Ioptions_queue {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'queue',
			name: 'building queue'
		};
	}

	get_description(): string {
		const { village_name } = this.options;

		if (!village_name)
			return 'lang_home_not_configured';

		return village_name;
	}

	get_long_description(): string {
		// key in the frontend language.js file
		return 'queue';
	}

	async run(): Promise<void> {
		logger.info(`uuid: ${this.options.uuid} started`, this.params.name);

		while (this.options.run) {
			const { village_id } = this.options;
			if (!village_id) {
				logger.error('stop feature because is not configured', this.params.name);
				this.options.error = true;
				break;
			}

			let sleep_time: number = await this.upgrade_queue();

			// queue done or error raised
			if (!sleep_time)
				break;

			// set save sleep time
			if (sleep_time > 300)
				sleep_time = 300;

			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`uuid: ${this.options.uuid} stopped`, this.params.name);
	}

	async upgrade_queue(): Promise<number> {
		const { village_id, queue } = this.options;
		var { village_name } = this.options;

		if (queue.length < 1) {
			logger.info(`building queue done on ${village_name}!`, this.params.name);
			return null;
		}

		let sleep_time: number = null;
		const five_minutes: number = 5 * 60;
		const queue_item: Iqueue = queue[0];
		const queue_type = queue_item.type > 4
			? 1  // 1: building slot
			: 2; // 2: resource slot
		const building_type = building_types[queue_item.type];

		const villages_data: any = await village.get_own();
		const village_obj: Ivillage = village.find(village_id, villages_data);
		village_name = village_obj.name;

		// fetch latest data needed
		const params: string[] = [
			village.building_collection_ident + village_id,
			village.building_queue_ident + village_id
		];
		const response: any[] = await api.get_cache(params);
		const queue_data: Ibuilding_queue = find_state_data(village.building_queue_ident + village_id, response);

		const free: boolean = queue_data.freeSlots[queue_type] == 1;
		const queue_free: boolean = queue_data.freeSlots[4] == 1;
		const canUseInstant: boolean =
			queue_data.canUseInstantConstruction || queue_data.canUseInstantConstructionOnlyInVillage;

		// skip if resource slot is used
		if (!free && !queue_free) {
			// get queue finish time
			let finished: number = null;
			if (queue_data.queues[2].length) {
				finished = queue_data.queues[2][0].finished;
			} else if (queue_data.queues[1].length) {
				finished = queue_data.queues[1][0].finished;
			} else {
				logger.error('error calculating queue time! queue object:', this.params.name);
				logger.error(queue_data.queues, this.params.name);
			}

			if (finished) {
				// set sleep time until its finished
				const res_time: number = get_diff_time(finished);
				if (res_time > 0) {
					sleep_time = res_time;
					if (sleep_time > five_minutes)
						sleep_time -= five_minutes;
				}
			}

			if (!sleep_time)
				sleep_time = 60;
			if (sleep_time <= 0)
				sleep_time = 5;
			return sleep_time;
		}

		// check building data
		let building: Ibuilding = null;
		const collection_data: Ibuilding_collection[] = find_state_data(village.building_collection_ident + village_id, response);
		for (let bd of collection_data) {
			if (Number(bd.data.buildingType) == queue_item.type) {
				building = bd.data;
				break;
			}
		}
		if (building == null) {
			logger.error(`could not get building ${building_type} data on village ${village_name}`, this.params.name);
			return five_minutes;
		}

		if (building.isMaxLvl) {
			logger.info(`building ${building_type} on village ${village_name} is already at the maximum level, removed from queue`, this.params.name);
			// delete queue item
			this.options.queue.shift();
			return 1;
		}

		if (!this.able_to_build(building.upgradeCosts, village_obj)) {
			// check again later if there might be enough res
			return five_minutes;
		}

		// upgrade building using free slot
		if (free) {
			const res: any = await api.upgrade_building(queue_item.type, queue_item.location, village_id);
			if (res.errors) {
				for (let error of res.errors)
					logger.error(`upgrade building ${building_type} on village ${village_name} failed: ${error.message}`, this.params.name);

				// check again later if it might be possible
				return 60;
			}

			logger.info(`upgrade building ${building_type} on village ${village_name}`, this.params.name);

			// delete queue item
			this.options.queue.shift();

			const upgrade_time: number = Number(building.upgradeTime);
			// check if building time is less than 5 min
			if (upgrade_time < five_minutes && finish_earlier.running && canUseInstant) {
				const res: any = await api.finish_now(village_id, queue_type);
				if (res.data === false) {
					logger.error(`instant finish on village ${village_name} failed`, this.params.name);

					// check again later if it might be possible
					return 60;
				}
				logger.info(`upgrade time less 5 min on village ${village_name}, instant finish!`, this.params.name);

				// only wait one second to build next building
				return 1;
			}
			else if (queue_free) {
				return 1;
			}

			// set sleep time
			if (!sleep_time || upgrade_time < sleep_time) {
				sleep_time = upgrade_time;
				if (sleep_time > five_minutes)
					sleep_time -= five_minutes;
			}
		}

		// upgrade building using queue slot
		else if (queue_free) {
			const res: any = await api.queue_building(queue_item.type, queue_item.location, village_id, true);
			if (res.errors) {
				for (let error of res.errors)
					logger.error(`upgrade building ${building_type} on village ${village_name} failed: ${error.message}`, this.params.name);

				// check again later if it might be possible
				return 60;
			} else {
				logger.info(`queue building ${building_type} on village ${village_name}`, this.params.name);
				// delete queue item
				this.options.queue.shift();
			}
		}

		if (!sleep_time || sleep_time <= 0)
			sleep_time = 60;

		return sleep_time;
	}

	able_to_build(costs: Iresources, village: Ivillage): boolean {
		for (let res in village.storage)
			if (Number(village.storage[res]) < Number(costs[res]))
				return false;
		return true;
	}
}

export default new building_queue();
