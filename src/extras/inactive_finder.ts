import axios from 'axios';
import settings from '../settings';
import api from '../api';
import { farming, village } from '../gamedata';
import { find_state_data } from '../util';
import { Ifarmfinder, Ifarmlist, Ivillage } from '../interfaces';
import { Iresponse } from '../features/feature';
import logger from '../logger';

class inactive_finder {

	async add_inactive_player(farmlist: string, inactive: Ifarmfinder): Promise<Iresponse> {
		const temp_data: any = await farming.get_own();
		const farmlist_data: Ifarmlist = farming.find(farmlist, temp_data);

		if (!farmlist_data) {
			return {
				error: true,
				message: 'could not find given farmlist',
				data: null
			};
		}

		const response: any = await api.toggle_farmlist_entry(inactive.id, farmlist_data.listId);
		if (response.errors) {
			return {
				error: true,
				message: response.errors[0]?.message,
				data: null
			};
		}

		return {
			error: false,
			message: 'toggled farmlist',
			data: null
		};
	}

	async get_new_farms(
		village_id: number,
		min_player_pop: number = 0,
		max_player_pop: number = 1000,
		min_village_pop: number = 0,
		max_village_pop: number = 500,
		max_villages: number = 3,
		max_evolution: number = 0,
		days: number = 5
	): Promise<any> {

		// get village coordinates
		const village_data = await village.get_own();
		const found_village: Ivillage = village.find(village_id, village_data);
		if (!found_village) {
			return {
				error: true,
				message: `couldn't find village with id: ${village_id}!`,
				data: null
			};
		}
		const { x, y } = found_village.coordinates;

		// get farmlists
		const farmlists = await farming.get_own();
		const data: any[] = find_state_data(farming.farmlist_ident, farmlists);
		const villages_farmlist: Array<number> = [];
		for (let farm of data) {
			const farm_data: Ifarmlist = farm.data;
			for (let id of farm_data.villageIds) {
				villages_farmlist.push(Number(id));
			}
		}

		// get engin9tools servers
		let servers: any;
		try {
			let url: string = 'https://api.travian.engin9tools.com/api/global/servers';
			servers = await axios.get(url);
		} catch (error:any) {
			return {
				error: true,
				message: error.response?.data?.message,
				data: null
			};
		}

		// get server id
		let server_id;
		for (let group of servers.data.data) {
			for (let server of group.servers) {
				if (server.address.includes(`${settings.gameworld}.`)) {
					server_id = server.id;
					break;
				}
			}
			if (server_id)
				break;
		}

		// find inactives
		let found = 0;
		const rv: any[] = [];
		for (let page = 0; page<10; page++) {
			const query: string =
				`/?serverId=${server_id}&x=${x}&y=${y}&days=${days}&maxVillages=${max_villages}&
				minPopVillage=${min_village_pop}&maxPopVillage=${max_village_pop}&
				minPopPlayer=${min_player_pop}&maxPopPlayer=${max_player_pop}&
				maxEvolution=${max_evolution}&onlyNewFarms=${false}&
				allowRomans=${true}&allowGauls=${true}&allowTeutons=${true}&
				allowAlliances=${true}&allowCapitals=${true}&page=${page}
				`.replace(/\s/g, '');

			let res: any;
			try {
				let url = 'https://api.travian.engin9tools.com/api/v1/farm-finder';
				res = await axios.get(url + query);
			} catch (error:any) {
				return {
					error: true,
					message: error.response?.data?.message,
					data: null
				};
			}

			let count = 0;
			for (let farm of res.data.data) {
				count++;
				if (count == 26)
					break;
				if (villages_farmlist.indexOf(Number(farm.id)) > -1)
					continue;
				rv.push(farm);
			}
			found += res.data.data.length == 26 ?
				25 : res.data.data.length;
			if (res.data.data.length < 26)
				break;
		}

		// get kingdom names
		const k_id_params: Set<string> = new Set();
		for (let farm of rv) {
			const kID: number = Number(farm.id_kingdom);
			if (kID == 0) continue;
			k_id_params.add('Kingdom:' + kID);
		}
		const kingdom_response = await api.get_cache(Array.from(k_id_params));
		if (kingdom_response) {
			const kingdom_data: { [index: number]: string } = {};

			for (let k_data of kingdom_response) {
				const k = k_data.data;
				kingdom_data[Number(k.groupId)] = k.tag;
			}

			for (let farm of rv) {
				const kID: number = Number(farm.id_kingdom);
				if (kID == 0) {
					farm['kingdom_tag'] = '-';
					continue;
				}
				farm['kingdom_tag'] = kingdom_data[kID];
			}
		}

		return {
			error: false,
			message: `${ found } found / ${ rv.length } displayed`,
			data: rv
		};
	}
}

export default new inactive_finder();
