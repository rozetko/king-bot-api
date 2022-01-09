import { Ivillage, Ibuilding_queue } from '../interfaces';
import { feature_single, Ioptions, Iresponse } from './feature';
import { get_diff_time, find_state_data, sleep } from '../util';
import { village } from '../gamedata';
import api from '../api';
import uniqid from 'uniqid';
import logger from '../logger';

class finish_earlier extends feature_single {
	building_queue_ident: string = 'BuildingQueue:';

	options: Ioptions;

	set_default_options(): void {
		this.options = {
			uuid: uniqid.time(),
			run: false,
			error: false
		};
	}

	set_params(): void {
		this.params = {
			ident: 'finish_earlier',
			name: 'instant finish'
		};
	}

	get_description(): string {
		return '5 min earlier';
	}

	set_options(options: Ioptions): void {
		const { run, error, uuid } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error
		};

	}

	get_options(): Ioptions {
		return { ...this.options };
	}

	update(options: Ioptions): Iresponse {
		return {
			error: false,
			data: null,
			message: ''
		};
	}

	async run(): Promise<void> {
		logger.info(`uuid: ${this.options.uuid} started`, this.params.name);

		while (this.options.run) {
			const villages_data: any = await village.get_own();

			let params: string[] = [];

			for (let data of find_state_data(village.collection_own_ident, villages_data)) {
				const vill: Ivillage = data.data;
				params.push(this.building_queue_ident + vill.villageId);
			}

			// fetch latest data needed
			let response: any[] = await api.get_cache(params);

			let sleep_time: number = null;
			const five_minutes: number = 5 * 60;

			for (let data of find_state_data(village.collection_own_ident, villages_data)) {
				const vill: Ivillage = data.data;
				const queue: Ibuilding_queue = find_state_data(this.building_queue_ident + vill.villageId, response);

				const queues: number[] = [1, 2];

				// for building and resource queue
				for (let qu of queues) {
					const actual_queue: any[] = queue.queues[qu];

					if (!actual_queue) continue;
					if (!actual_queue[0]) continue;

					const first_item: any = actual_queue[0];
					const finished: number = first_item.finished;

					const rest_time: number = get_diff_time(finished);

					// finish building instant
					if (rest_time < five_minutes) {
						const res = await api.finish_now(vill.villageId, qu);
						logger.info(`finished building earlier for free on village ${vill.name}`, this.params.name);
						continue;
					}

					if (!sleep_time) sleep_time = rest_time;
					else if (rest_time < sleep_time) sleep_time = rest_time;
				}
			}

			if (sleep_time && sleep_time > five_minutes)
				sleep_time = sleep_time - five_minutes;

			if (!sleep_time || sleep_time <= 0) sleep_time = 60;
			if (sleep_time > 300) sleep_time = 300;

			await sleep(sleep_time);
		}

		logger.info(`uuid: ${this.options.uuid} stopped`, this.params.name);
		this.running = false;
		this.options.run = false;
	}
}

export default new finish_earlier();
