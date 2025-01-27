import settings from '../settings';
import api from '../api';
import { village } from '../gamedata';
import { Icropfinder, Imap_details, Ivillage } from '../interfaces';
import { find_state_data } from '../util';
import { oasis_type, res_type } from '../data';

class crop_finder {

	async get_crops(
		village_id: number,
		find_15c: boolean,
		find_9c: boolean,
		only_free: boolean
	): Promise<any> {

		// default values
		if (!find_15c && !find_9c)
			find_15c = find_9c = true;

		// find village
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

		// get actual map
		const map_data = await api.get_map(settings.gameworld);
		if (map_data.errors) {
			return {
				error: true,
				message: map_data.errors[0]?.message,
				data: null
			};
		}

		// find 9c and 15c crops
		const cells: any = this.discover_crops(map_data);

		// find oases with crop bonus
		const oases: any = this.discover_oases(map_data);

		// get map details
		let map_details: Imap_details = null;
		const params: Set<string> = new Set();
		for (let cell of cells) {
			if (Number(cell.id) == 0)
				continue;
			if (this.filter_type(cell.resType, find_15c, find_9c))
				continue;
			params.add(village.map_details_ident + cell.id);
		}
		const map_details_data: any[] = await api.get_cache(Array.from(params));

		// filter and sort crops
		let crops = [];
		for (let cell of cells) {
			if (this.filter_type(cell.resType, find_15c, find_9c))
				continue;

			map_details = find_state_data(village.map_details_ident + cell.id, map_details_data);
			if (!map_details)
				continue;

			const free = map_details?.playerName == null;
			if (only_free && !free)
				continue;

			const bonus = this.calculate_bonus(Number(cell.x), Number(cell.y), oases);

			const distance = this.calculate_distance(cell, x, y);

			const crop : Icropfinder = {
				id: cell.id,
				x: cell.x,
				y: cell.y,
				is_15c: cell.resType === res_type.c15,
				bonus: bonus,
				playerId: map_details?.playerId,
				player_name: map_details?.playerName,
				distance: distance,
				free: free
			};
			crops.push(crop);
		}

		// sort by distance, lowest on top
		crops.sort((a, b) => a.distance - b.distance);

		return {
			error: false,
			message: `${ crops.length } found`,
			data: crops
		};
	}

	discover_crops(map_data: any): any {
		const crops = [];
		for (let cell of map_data.map.cells) {
			switch (cell.resType) {
				case res_type.c15:
				case res_type.c9:
					crops.push(cell);
					break;
			}
		}
		return crops;
	}

	discover_oases(map_data: any): any {
		const oases = [];
		for (let cell of map_data.map.cells) {
			switch (cell.oasis)
			{
				case oasis_type.wood_1:
				case oasis_type.clay_1:
				case oasis_type.iron_1:
				case oasis_type.crop:
				case oasis_type.crop_1:
					oases.push(cell);
					break;
			}
		}
		return oases;
	}

	filter_type(resType: any, find_15c: boolean, find_9c: boolean) {
		const is_15c = resType === res_type.c15;
		const is_9c = resType === res_type.c9;
		return (!find_15c || !is_15c) && (!find_9c || !is_9c);
	}

	calculate_distance(village: any, x: number, y: number) {
		return Math.hypot(Number(village.x) - x, Number(village.y) - y);
	}

	calculate_bonus(x: number, y: number, oases: any[]): number {
		const embassy_slots : number[] = [];
		for (let location_id of this.get_influence_area(x, y)) {

			const oasis = oases.find((oasis: any) => {
				return oasis.id == location_id;
			});
			if (!oasis)
				continue;

			const crop_bonus = oasis.oasis == '41' ? 50 : 25;

			if (embassy_slots.length < 3) {
				embassy_slots.push(crop_bonus);
				continue;
			}

			for (let slot = 0; slot < embassy_slots.length; slot++) {
				if (crop_bonus > embassy_slots[slot]) {
					embassy_slots[slot] = crop_bonus;
					break;
				}
			}
		}
		return embassy_slots.length ?
			embassy_slots.reduce((a, b) => Number(a) + Number(b)) : 0;
	}

	get_influence_area(x: number, y: number) : number[] {
		const area = [];
		// generate left side
		for (let _x = (x - 3); _x <= (x + 3); _x++)
			for (let _y = (y - 3); _y < y; _y++)
				area.push(this.get_location_id(_x, _y));
		// generate right side
		for (let _x = (x - 3); _x <= (x + 3); _x++)
			for (let _y = y; _y <= (y + 3); _y++)
				area.push(this.get_location_id(_x, _y));
		return area;
	}

	get_location_id(x: number, y: number) : number {
		return 536887296 + x + (y * 32768);
	}
}

export default new crop_finder();
