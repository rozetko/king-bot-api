import { find_state_data, sleep, get_diff_time } from '../util';
import { Ivillage, Ibuilding, Iresearch, Iresearch_unit, Iresearch_queue } from '../interfaces';
import { feature_collection, feature_item, Ioptions } from './feature';
import { village } from '../gamedata';
import api from '../api';
import logger from '../logger';

interface Ioptions_improve_troops extends Ioptions {
	[index: string]: any
	village_name: string
	village_id: number
	unit_type: number
	unit_type_name: string
	level: number
}

class improve_troops extends feature_collection {
	get_ident(): string {
		return 'improve_troops';
	}

	get_new_item(options: Ioptions_improve_troops): train_feature {
		return new train_feature({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_improve_troops {
		return {
			...options,
			village_name: '',
			village_id: 0,
			unit_type: 0,
			unit_type_name: '',
			level: 0
		};
	}
}

class train_feature extends feature_item {
	options: Ioptions_improve_troops;

	set_options(options: Ioptions_improve_troops): void {
		const { uuid, run, error,
			village_id,	village_name,
			unit_type, unit_type_name, level } = options;

		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_id,
			village_name,
			unit_type,
			unit_type_name,
			level
		};
	}

	get_options(): Ioptions_improve_troops {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'improve_troops',
			name: 'improve troops',
		};
	}

	get_description(): string {
		const { village_name, unit_type_name, level } = this.options;

		if (!village_name)
			return '<not configured>';

		return `${village_name} -> ${unit_type_name} (${level == 20 ? 'max lvl' : `lvl ${level}`})`;
	}

	get_long_description(): string {
		// key in the frontend language.js file
		return 'improve_troops';
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

			let sleep_time: number = await this.improve_troops();

			// improving done or error raised
			if (!sleep_time)
				break;

			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`uuid: ${this.options.uuid} stopped`, this.params.name);
	}

	async improve_troops(): Promise<number> {
		const {
			village_id, village_name, unit_type, unit_type_name, level } = this.options;

		let sleep_time: number = 3600;

		// get village
		const villages_data: any = await village.get_own();
		const village_obj: Ivillage = village.find(village_id, villages_data);

		// get research and queue
		const research_ident: string = 'Research:';
		const unit_research_queue_ident: string = 'UnitResearchQueue:';
		let params: string[] = [];
		params.push(unit_research_queue_ident + village_id);
		params.push(research_ident + village_id);
		const response: any[] = await api.get_cache(params);
		const research: Iresearch = find_state_data(research_ident + village_id, response);
		const research_queue: Iresearch_queue = find_state_data(unit_research_queue_ident + village_id, response);

		if (research.upgradeQueueFull) {
			let finished: number = null;
			if (research_queue.buildingTypes[13]) {
				const building = research_queue.buildingTypes[13];
				for (let unit of building) {
					if (!finished || finished > unit.finished)
						finished = unit.finished;
				}
			}
			if (finished) {
				// set sleep time until its finished
				const res_time: number = get_diff_time(finished);
				if (res_time > 0)
					sleep_time = res_time;
			}
			return sleep_time;
		}

		// get unit data
		let unit_data: Iresearch_unit = null;
		for (let research_unit of research.units) {
			if (research_unit.unitType != unit_type)
				continue;
			unit_data = research_unit;
			break;
		}
		if (!unit_data) {
			logger.error(
				`improving unit type ${unit_type_name} in village ${village_name} failed ` +
				'because unit type is not available to research',
				this.params.name);
			this.options.error = true;
			return null;
		}

		if (Number(unit_data.unitLevel) == Number(unit_data.maxLevel)) {
			logger.info(`improving unit type ${unit_type_name} in ${village_name} done at max level!`, this.params.name);
			return null;
		}

		if (Number(unit_data.unitLevel) == Number(level)) {
			logger.info(`improving unit type ${unit_type_name} in ${village_name} done at level ${level}!`, this.params.name);
			return null;
		}

		if (!unit_data.canResearch || !unit_data.canUpgrade) {
			logger.error(
				`improving unit type ${unit_type_name} in village ${village_name} failed ` +
				'because unit type has not been learned',
				this.params.name);
			this.options.error = true;
			return null;
		}

		// get resources cost
		let costs = unit_data.costs;

		// get village resources
		let resources = village_obj.storage;

		// check if there are sufficient resources to improve
		let can_upgrade = true;
		can_upgrade = can_upgrade && (costs[1] <= resources[1]);
		can_upgrade = can_upgrade && (costs[2] <= resources[2]);
		can_upgrade = can_upgrade && (costs[3] <= resources[3]);
		can_upgrade = can_upgrade && (costs[4] <= resources[4]);
		if (!can_upgrade) {
			return sleep_time;
		}

		// smithy building type
		const building_type: number = 13;

		// get building data
		const building_data: Ibuilding = await village.get_building(village_id, building_type);
		const location_id = building_data.locationId;

		// research unit
		const next_level = Number(unit_data.unitLevel) + 1;
		const research_unit: any = await api.research_unit(village_id, location_id, building_type, unit_type);
		if (research_unit.errors) {
			for (let error of research_unit.errors)
				logger.error(`improving unit type ${unit_type_name} to level ${next_level} ` +
				`in village ${village_name} failed: ${error.message}`, this.params.name);
			return sleep_time;
		}
		logger.info(
			`improving unit type ${unit_type_name} to level ${next_level} in village ${village_name} `+
			`with a cost of wood: ${costs[0]}, clay: ${costs[1]}, iron: ${costs[2]}`,
			this.params.name);

		// set sleep time until its finished
		sleep_time = unit_data.time;

		return sleep_time;
	}
}

export default new improve_troops();