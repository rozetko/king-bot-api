import { sleep } from '../util';
import { Iunits, Ihero, Iplayer, Itarget, Idurations } from '../interfaces';
import { feature_collection, feature_item, Ioptions } from './feature';
import { player, hero } from '../gamedata';
import { unit_types, tribe, hero_status, mission_type } from '../data';
import api from '../api';
import database from '../database';
import logger from '../logger';

interface Ioptions_timed_send extends Ioptions {
	village_name: string,
	village_id: number,
	target_x: string,
	target_y: string,
	target_village_id: number,
	target_village_name: string,
	target_distance: string,
	target_player_name: string,
	mission_type: mission_type,
	mission_type_name: string,
	arrival_date: string,
	arrival_time: string,
	date: string,
	time: string,
	timetype: string,
	timetype_name: string,
	timezone: string,
	timezone_name: string,
	t1: number,
	t2: number,
	t3: number,
	t4: number,
	t5: number,
	t6: number,
	t7: number,
	t8: number,
	t9: number,
	t10: number,
	t11: number
}

class timed_send extends feature_collection {
	get_ident(): string {
		return 'timed_send';
	}

	get_new_item(options: Ioptions_timed_send): timed_send_feature {
		return new timed_send_feature({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_timed_send {
		return {
			...options,
			village_name: null,
			village_id: 0,
			target_x: '',
			target_y: '',
			target_village_id: 0,
			target_village_name: null,
			target_distance: null,
			target_player_name: null,
			mission_type: 0,
			mission_type_name: null,
			arrival_date: null,
			arrival_time: null,
			date: null,
			time: null,
			timetype: '',
			timetype_name: '',
			timezone: '',
			timezone_name: '',
			t1: 0,
			t2: 0,
			t3: 0,
			t4: 0,
			t5: 0,
			t6: 0,
			t7: 0,
			t8: 0,
			t9: 0,
			t10: 0,
			t11: 0
		};
	}
}

class timed_send_feature extends feature_item {
	options: Ioptions_timed_send;

	set_options(options: Ioptions_timed_send): void {
		const { uuid, run, error, village_name,
			village_id,
			target_x,
			target_y,
			target_village_id,
			target_village_name,
			target_distance,
			target_player_name,
			mission_type,
			mission_type_name,
			arrival_date,
			arrival_time,
			date,
			time,
			timetype,
			timetype_name,
			timezone,
			timezone_name,
			t1,
			t2,
			t3,
			t4,
			t5,
			t6,
			t7,
			t8,
			t9,
			t10,
			t11 } = options;

		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			village_id,
			target_x,
			target_y,
			target_village_id,
			target_village_name,
			target_distance,
			target_player_name,
			mission_type,
			mission_type_name,
			arrival_date,
			arrival_time,
			date,
			time,
			timetype,
			timetype_name,
			timezone,
			timezone_name,
			t1,
			t2,
			t3,
			t4,
			t5,
			t6,
			t7,
			t8,
			t9,
			t10,
			t11
		};
	}

	get_options(): Ioptions_timed_send {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'timed_send',
			name: 'timed send'
		};
	}

	get_description(): string {
		const { village_name, mission_type_name, target_village_name, date, time, timetype_name, timezone_name } = this.options;

		if (!village_name)
			return '<not configured>';

		const lang = database.get('language').value();
		const format_options: any = { weekday: 'long', month: 'long', day: 'numeric' };
		const date_string = new Date(`${date} ${time}`).toLocaleDateString(lang, format_options);

		return `${village_name} -> ${mission_type_name} ${target_village_name}:
				${date_string}, ${time} (${timetype_name}${timezone_name})`;
	}

	get_long_description(): string {
		// key in the frontend language.js file
		return 'timed_send';
	}

	async run(): Promise<void> {
		logger.info(`uuid: ${this.options.uuid} started`, this.params.name);

		var { village_id, village_name,
			target_village_id, target_village_name,
			mission_type, mission_type_name,
			arrival_date, arrival_time,
			t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11 } = this.options;

		const units: Iunits = {
			1: Number(t1),
			2: Number(t2),
			3: Number(t3),
			4: Number(t4),
			5: Number(t5),
			6: Number(t6),
			7: Number(t7),
			8: Number(t8),
			9: Number(t9),
			10: Number(t10),
			11: Number(t11)
		};

		// feature check
		if (!village_id) {
			logger.error('aborted timed send because the feature is not configured', this.params.name);
			return this.exit();
		}

		// check units
		if (units[1]==0 && units[2]==0 && units[3]==0 && units[4]==0 &&
			units[5]==0 && units[6]==0 && units[7]==0 && units[8]==0 &&
			units[9]==0 && units[10]==0 && units[11]==0)
		{
			logger.error(`aborted timed ${mission_type_name} from ${village_name} to ${target_village_name} ` +
			'because no units have been defined', this.params.name);
			return this.exit();
		}

		const player_data: Iplayer = await player.get();
		const own_tribe: tribe = player_data.tribeId;

		const arrival_time_ms = new Date(arrival_date + 'T' + arrival_time + 'Z').getTime();

		let loop = 0;
		while (this.options.run) {
			this.set_options(this.options);
			loop++;

			// check target
			const target_data: Itarget = await api.check_target(village_id, target_village_id, mission_type);
			let target_durations: Idurations = target_data.durations;

			// set duration by the lowest speed
			var speed = 100;
			var duration = 0;
			for (var key in units) {
				if (Object.prototype.hasOwnProperty.call(units, Number(key))) {
					if (units[key] > 0) {
						// hero speed
						if (key == '11') {
							let hero_speed = (await hero.get()).speed;
							if (hero_speed < speed) {
								duration = target_durations[key];
								duration = duration * 1000; // to ms
								speed = hero_speed;
							}
							continue;
						}
						// unit speed
						if (Number(unit_types[own_tribe][key].speed) < speed) {
							duration = target_durations[key];
							duration = duration * 1000; // to ms
							speed = Number(unit_types[own_tribe][key].speed);
							continue;
						}
					}
				}
			}

			// set times
			var send_time_ms = arrival_time_ms - duration;
			var current_time_ms = Date.now();
			var diff_time_ms = send_time_ms - current_time_ms;
			var duration_short = this.get_duration(duration);

			// debug
			logger.debug(`[${loop}] arrival time: ${logger.get_timestamp(new Date(arrival_time_ms))} | ` +
			`duration: ${duration_short} | ` +
			`send: ${logger.get_timestamp(new Date(send_time_ms))} | ` +
			`left: ${Math.floor(diff_time_ms / 1000)} seconds`, this.params.name);

			if (send_time_ms < current_time_ms + 2000) {

				if (send_time_ms <= current_time_ms) {

					// check hero
					let send_hero: boolean = t11 > 0;
					if (send_hero) {

						// get hero data
						const hero_data: Ihero = await hero.get();

						if (hero_data.isMoving || hero_data.status != hero_status.idle)
						{
							logger.error(`aborted timed ${mission_type_name} from ${village_name} to ${target_village_name} ` +
							`because the hero is ${hero.get_hero_status(hero_data.status)}`, this.params.name);
							break; // stop
						}
						if (hero_data.villageId != village_id) {
							logger.error(`aborted timed ${mission_type_name} from ${village_name} to ${target_village_name} ` +
							'because the hero is not from this village', this.params.name);
							break; // stop
						}
					}

					// send units
					var response: any = await api.send_units(village_id, target_village_id, units, mission_type);
					if (response.errors) {
						for (let error of response.errors)
							logger.error(`timed ${mission_type_name} from ${village_name} to ${target_village_name} failed: ${error.message}`, this.params.name);
						break; // stop
					}
					logger.info(`sent timed ${mission_type_name} from ${village_name} to ${target_village_name} ` +
					`arriving on ${logger.get_timestamp(new Date(arrival_time_ms))} ` +
					`(duration: ${duration_short})`, this.params.name);
					break; // stop
				}
				else {
					await sleep(1);	// sleep 1 second
				}
			}
			else {
				// sleep until the time difference, in seconds
				await sleep(Math.floor(diff_time_ms / 1000));
			}
		}

		this.exit();
	}

	exit(): void {
		logger.info(`uuid: ${this.options.uuid} stopped`, this.params.name);
		this.running = false;
		this.options.run = false;
	}

	get_duration(duration: number): string {
		var seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

		return `${(hours < 10) ? '0' + hours : hours}:` +
			`${(minutes < 10) ? '0' + minutes : minutes}:` +
			`${(seconds < 10) ? '0' + seconds : seconds}`;
	}
}

export default new timed_send();