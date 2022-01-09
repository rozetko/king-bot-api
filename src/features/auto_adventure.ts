import { Ihero } from '../interfaces';
import { feature_single, Ioptions, Iresponse } from './feature';
import { get_diff_time, sleep } from '../util';
import { adventure_type, hero_status } from '../data';
import { hero } from '../gamedata';
import api from '../api';
import database from '../database';
import uniqid from 'uniqid';
import logger from '../logger';

interface Ioptions_hero extends Ioptions {
	type: adventure_type
	min_health: number
}

class auto_adventure extends feature_single {
	options: Ioptions_hero;

	set_default_options(): void {
		this.options = {
			uuid: uniqid.time(),
			type: 0,
			min_health: 15,
			run: false,
			error: false
		};
	}

	set_params(): void {
		this.params = {
			ident: 'hero',
			name: 'auto adventure'
		};
	}

	get_long_description(): string {
		// key in the frontend language.js file
		return 'hero';
	}

	set_options(options: Ioptions_hero): void {
		const { run, error, type, min_health, uuid } = options;
		this.options = {
			...this.options,
			uuid,
			type,
			min_health,
			run,
			error
		};
	}

	get_options(): Ioptions {
		return { ...this.options };
	}

	get_description(): string {
		return (this.options.type == 0) ? 'short' : 'long';
	}

	update(options: Ioptions_hero): Iresponse {
		this.options = {
			...this.options,
			min_health: options.min_health,
			type: options.type
		};

		return {
			error: false,
			data: null,
			message: 'success'
		};
	}

	async run(): Promise<void> {
		this.auto_adventure(this.options.type, this.options.min_health);
	}

	async auto_adventure(type: adventure_type, min_health: number): Promise<void> {
		logger.info(`uuid: ${this.options.uuid} started`, this.params.name);

		// write data to database
		this.options.min_health = min_health;
		this.options.type = type;
		this.options.run = true;

		database.set('hero.options', this.options).write();

		while (this.options.run) {
			const { type, min_health } = this.options;

			// get hero data
			const hero_data: Ihero = await hero.get();

			if (hero_data.adventurePoints > 0 && !hero_data.isMoving &&
				hero_data.status == hero_status.idle && Number(hero_data.health) > min_health) {

				let send: boolean = false;
				if (type == adventure_type.short && Number(hero_data.adventurePoints) > 0)
					send = true;
				else if (type == adventure_type.long && Number(hero_data.adventurePoints > 1))
					send = true;

				if (send) {
					await api.start_adventure(type);
					logger.info('sent hero on adventure', this.params.name);
				}
			}

			const diff_time: number = get_diff_time(hero_data.untilTime);
			let sleep_time: number = 60;

			if (diff_time > 0) sleep_time = diff_time + 5;
			if (sleep_time <= 0) sleep_time = 300;
			if (sleep_time > 500) sleep_time = 500;

			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`uuid: ${this.options.uuid} stopped`, this.params.name);
	}
}

export default new auto_adventure();
