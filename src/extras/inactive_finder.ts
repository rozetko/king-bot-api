import settings from '../settings';
import api from '../api';
import { farming, village } from '../gamedata';
import { find_state_data, zip } from '../util';
import { Ifarmfinder, Ifarmlist, Ivillage } from '../interfaces';
import { Iresponse } from '../features/feature';

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

		const response: any = await api.toggle_farmlist_entry(inactive.villageId, farmlist_data.listId);
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
		min_player_pop: number,
		max_player_pop: number,
		min_village_pop: number,
		max_village_pop: number,
		inactive_for: number,
		min_distance: number,
		max_distance: number
	): Promise<any> {

		// default values
		if (!min_player_pop || isNaN(min_player_pop))
			min_player_pop = 0;
		if (!max_player_pop || isNaN(max_player_pop))
			max_player_pop = 500;
		if (!min_village_pop || isNaN(min_village_pop))
			min_village_pop = 0;
		if (!max_village_pop || isNaN(max_village_pop))
			max_village_pop = 200;
		if (!inactive_for || isNaN(inactive_for))
			inactive_for = 5;
		if (!min_distance || isNaN(min_distance))
			min_distance = 0;
		if (!max_distance || isNaN(max_distance))
			max_distance = 100;

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

		const inactives: any = await this.get_inactives(
			settings.gameworld,
			inactive_for,
			min_village_pop,
			max_player_pop,
			min_player_pop,
			max_player_pop,
			x, y,
			min_distance,
			max_distance);
		if (inactives.errors) {
			return {
				error: true,
				message: inactives.errors[0]?.message,
				data: null
			};
		}

		const farmlists = await farming.get_own();
		const data: any[] = find_state_data(farming.farmlist_ident, farmlists);
		const villages_farmlist: Array<number> = [];
		for (let farm of data) {
			const farm_data: Ifarmlist = farm.data;
			for (let id of farm_data.villageIds) {
				villages_farmlist.push(Number(id));
			}
		}

		const rv: any[] = [];
		for (let farm of inactives) {
			if (villages_farmlist.indexOf(Number(farm.villageId)) > -1)
				continue;
			rv.push(farm);
		}

		// get kingdom names
		const k_id_params: Set<string> = new Set();
		for (let farm of rv) {
			const kID: number = Number(farm.kingdomId);
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
				const kID: number = Number(farm.kingdomId);
				if (kID == 0) {
					farm['kingdom_tag'] = '-';
					continue;
				}
				farm['kingdom_tag'] = kingdom_data[kID];
			}
		}

		return {
			error: false,
			message: `${ inactives.length } found / ${ rv.length } displayed`,
			data: rv
		};
	}

	async get_inactives(
		gameworld: string,
		inactivity_days: number,
		min_village_pop: number,
		max_village_pop: number,
		min_player_pop: number,
		max_player_pop: number,
		x: number,
		y: number,
		min_distance: number,
		max_distance: number) : Promise<any> {

		// get actual map
		const map_data = await api.get_map(gameworld);
		if (map_data.errors)
			return map_data;

		// get aged map
		var aged_map_date = new Date();
		aged_map_date.setDate(aged_map_date.getDate()-inactivity_days);
		const aged_map_data = await api.get_map(gameworld, aged_map_date);
		if (aged_map_data.errors)
			return map_data;

		// find inactive players
		let matches = [];
		const inactive_players: any = this.discover_inactive_players(map_data, aged_map_data);
		for (let player of inactive_players) {
			let player_pop = 0;
			for (let village of player.villages)
				player_pop += Number(village.population);

			if (player_pop > max_player_pop || player_pop < min_player_pop)
				continue; // continue if max player pop is reached or min is reached

			// max player pop didnt reached
			for (let village of player.villages) {
				let vil_pop = Number(village.population);
				if (vil_pop > max_village_pop || vil_pop < min_village_pop)
					continue; // continue if pop is too high or too low

				let distance = this.calculate_distance(village, x, y);
				if (distance > max_distance || distance < min_distance)
					continue; // continue of distance is too high or too low

				const farm : Ifarmfinder = {
					villageId: village.villageId,
					x: village.x,
					y: village.y,
					population: village.population,
					village_name: village.name,
					isMainVillage: village.isMainVillage,
					isCity: village.isCity,
					playerId: player.playerId,
					player_name: player.name,
					tribeId: player.tribeId,
					kingdomId: player.kingdomId,
					distance: distance
				};
				matches.push(farm);
			}
		}

		// sort by distance, lowest on top
		matches.sort((a, b) => a.distance - b.distance);

		return matches;
	}

	discover_players(map_data: any, aged_map_data: any): Promise<any> {
		const recent_players = map_data.players;
		const aged_players = aged_map_data.players;
		const overlap_recent_players = [];
		const overlap_aged_players = [];
		for (let recent_player of recent_players) {
			for (let aged_player of aged_players) {
				if (recent_player.playerId == aged_player.playerId)
				{
					overlap_recent_players.push(recent_player);
					overlap_aged_players.push(aged_player);
				}
			}
		}
		var list = [overlap_recent_players, overlap_aged_players];
		return zip(list); // return an array from pairs
	}

	discover_inactive_players(map_data: any, aged_map_data: any) {
		const inactive_players = [];
		const overlapping_players: any = this.discover_players(map_data, aged_map_data);
		for (let player of overlapping_players) {
			var recent_data = player[0];
			var aged_data = player[1];

			if (recent_data.villages.length != aged_data.villages.length)
				continue; // can't be inactive due to increase in village quantity
			if (this.compare_village_populations(recent_data.villages, aged_data.villages))
				continue; // population difference detected

			inactive_players.push(recent_data);
		}
		return inactive_players;
	}

	calculate_distance(village: any, x: number, y: number) {
		return Math.hypot(Number(village.x) - x, Number(village.y) - y);
	}

	compare_village_populations(recent_data: any, aged_data: any) {
		for (let recent_village of recent_data) {
			let found = false;
			for (let aged_village of aged_data) {
				if (Number(aged_village.villageId) == Number(recent_village.villageId)) {
					var recent = Number(recent_village.population);
					var aged = Number(aged_village.population);
					if (recent > aged)
						return true;

					// village got cat down more than residence and wall, player might still be active
					if (recent < (aged - 30))
						return true;

					found = true;
					break; // go on with the next recent village
				}
			}
			if (!found)
				return true; // village not found, player moved via menhir
		}
		return false;
	}
}

export default new inactive_finder();
