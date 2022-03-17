import express from 'express';
import path from 'path';
import kingbot from './index';
import api from './api';
import settings from './settings';
import logger from './logger';
import { inactive_finder } from './extras';
import { building_types, tribe, troops_status, troops_type, unit_types } from './data';
import { Ifeature_params, feature } from './features/feature';
import { Ivillage, Ibuilding, Iplayer, Iunits } from './interfaces';
import { find_state_data } from './util';
import {
	finish_earlier,
	auto_adventure,
	send_farmlist,
	building_queue,
	raise_fields,
	trade_route,
	timed_send,
	train_troops,
	improve_troops,
	robber_hideouts
} from './features';
import { farming, village, player, troops } from './gamedata';
import database from './database';

class server {
	app: any = null;

	features: feature[] = [
		finish_earlier,
		auto_adventure,
		send_farmlist,
		building_queue,
		raise_fields,
		trade_route,
		timed_send,
		train_troops,
		improve_troops,
		robber_hideouts
	];

	constructor() {
		this.app = express();

		this.app.use(express.json());

		this.app.use(express.static(path.resolve(__dirname, '../public')));

		this.app.get('/api/allfeatures', (req: any, res: any) => {
			let response: Ifeature_params[] = [];

			for (let feat of this.features) response = [...response, ...feat.get_feature_params()];

			// sort features by group and description
			var compareFeatures = function (feat1: Ifeature_params, feat2: Ifeature_params) {
				if (feat1.long_description == 'hero' || feat2.long_description == 'hero')
					return 1;
				if (feat1.long_description == feat2.long_description)
					return feat1.description > feat2.description ? -1 : 1;
				return feat1.long_description > feat2.long_description ? -1 : 1;
			};

			res.send(response.sort(compareFeatures));
		});

		this.app.post('/api/feature', (req: any, res: any) => {
			const { feature } = req.body;
			const ident = feature.ident;

			let response: string = '';

			for (let feat of this.features) {
				if (feat.get_ident() == ident) {
					response = feat.handle_request(req.body);
					break;
				}
			}

			res.send(response);
		});

		this.app.get('/api/data', async (req: any, res: any) => {
			const { ident } = req.query;

			if (ident == 'villages') {
				const villages = await village.get_own();
				const data = find_state_data(village.collection_own_ident, villages);
				res.send(data);
				return;
			}

			if (ident == 'worldwonders') {
				const response = await api.get_world_wonders();
				res.send(response.results);
				return;
			}

			if (ident == 'farmlists') {
				const farmlists = await farming.get_own();
				const data = find_state_data(farming.farmlist_ident, farmlists);
				res.send(data);
				return;
			}

			if (ident == 'player_tribe') {
				const player_data: Iplayer = await player.get();
				const data: tribe = player_data.tribeId;
				res.send(data);
				return;
			}

			if (ident == 'player_settings') {
				const player_data: Iplayer = await player.get();
				const settings_ident: string = 'Settings:' + player_data.playerId;
				const response: any[] = await api.get_cache([settings_ident]);
				const settings_data = find_state_data(settings_ident, response);
				res.send(settings_data);
				return;
			}

			if (ident == 'buildings') {
				const { village_id } = req.query;
				const queue_ident: string = village.building_collection_ident + village_id;
				const response: any[] = await api.get_cache([queue_ident]);
				const rv = [];
				const data = find_state_data(queue_ident, response);
				for (let bd of data) {
					const build: Ibuilding = bd.data;

					if (Number(build.buildingType) != 0)
						if (Number(build.lvl) > 0)
							rv.push(build);
				}
				res.send(rv);
				return;
			}

			if (ident == 'village') {
				const { village_id } = req.query;
				const village_data = await village.get_own();
				const village_obj: Ivillage = village.find(village_id, village_data);
				res.send(village_obj);
				return;
			}

			if (ident == 'building_types') {
				res.send(building_types);
				return;
			}

			if (ident == 'units') {
				const { village_id } = req.query;
				const units: Iunits = await troops.get_units(village_id, troops_type.stationary, troops_status.home);
				res.send(units);
				return;
			}

			if (ident == 'unit_types') {
				res.send(unit_types);
				return;
			}

			if (ident == 'settings') {
				res.send({
					email: settings.email,
					gameworld: settings.gameworld,
					avatar_name: settings.avatar_name
				});
				return;
			}

			if (ident == 'logger') {
				// send latest 100 logs to frontend
				res.send(logger.log_list.slice(-100));
				return;
			}

			if (ident == 'language') {
				const language = database.get('language').value();
				res.send({ language });
				return;
			}

			res.send('error');
		});

		this.app.post('/api/language', async (req: any, res: any) => {
			const { language } = req.body;
			database.set('language', language).write();
			res.send({ status: 'ok' });
		});

		this.app.post('/api/find', async (req: any, res: any) => {
			const response = await api.get_cache(req.body);
			res.send(response);
		});

		this.app.post('/api/checkTarget', async (req: any, res: any) => {
			const response = await api.check_target(req.body.villageId, req.body.destVillageId, 4);
			res.send(response);
		});

		this.app.post('/api/easyscout', (req: any, res: any) => {
			const { village_id, list_name, amount, spy_mission } = req.body;

			kingbot.scout(list_name, village_id, amount, spy_mission);

			res.send('success');
		});

		this.app.post('/api/login', async (req: any, res: any) => {
			const { gameworld, email, password, sitter_type, sitter_name } = req.body;

			settings.write_credentials(gameworld, email, password, sitter_type, sitter_name);
			process.exit();

			res.send('this wont be send anyways...');
		});

		this.app.post('/api/inactivefinder', async (req: any, res: any) => {
			const { action, data } = req.body;

			if (action == 'get') {
				const {
					min_player_pop,
					max_player_pop,
					min_village_pop,
					max_village_pop,
					village_id,
					inactive_for,
					min_distance,
					max_distance
				} = data;

				const response = await inactive_finder.get_new_farms(
					min_player_pop, max_player_pop,
					min_village_pop, max_village_pop,
					village_id, inactive_for,
					min_distance, max_distance
				);

				res.send(response);
				return;
			}

			if (action == 'toggle') {
				const { farmlist, village } = data;
				const response = await inactive_finder.add_inactive_player(farmlist, village);

				res.send(response);
				return;
			}

			res.send({
				error: true,
				message: 'could not identify action',
				data: []
			});
		});

		// handles all 404 requests to main page
		this.app.get('*', (req: any, res: any) => {
			res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
		});
	}

	async start(port: number) {
		this.app.listen(port, () => {
			logger.info(`server running on => http://${settings.ip}:${port}`, 'server');

			// start all features on startup
			for (let feat of this.features) feat.start_for_server();
		});
	}

}

export default new server();
