import settings from '../settings';
import api from '../api';
import { village } from '../gamedata';
import { Iresourcefinder, Imap_details, Ivillage } from '../interfaces';
import { find_state_data } from '../util';
import { oasis_type, res_type } from '../data';

class resource_finder {

	async get_resources(
		village_id: number,
		find_wood: boolean,
		find_clay: boolean,
		find_iron: boolean,
		only_free: boolean
	): Promise<any> {

		// default values
		if (!find_wood && !find_clay && !find_iron)
			find_wood = find_clay = find_iron = true;

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

		// find cells with 5 resource bonus
		const cells: any = this.discover_resources(map_data);

		// find oases with resource bonus
		const oases: any = this.discover_oases(map_data);

		// get map details
		let map_details: Imap_details = null;
		const params: Set<string> = new Set();
		for (let cell of cells) {
			if (Number(cell.id) == 0)
				continue;
			if (this.filter_type(cell.resType, find_wood, find_clay, find_iron))
				continue;
			params.add(village.map_details_ident + cell.id);
		}
		const map_details_data: any[] = await api.get_cache(Array.from(params));

		// filter and sort resources
		let resources = [];
		for (let cell of cells) {
			if (this.filter_type(cell.resType, find_wood, find_clay, find_iron))
				continue;

			map_details = find_state_data(village.map_details_ident + cell.id, map_details_data);
			if (!map_details)
				continue;

			const free = map_details?.playerName == null;
			if (only_free && !free)
				continue;

			const bonus = this.calculate_bonus(cell, oases);

			const distance = this.calculate_distance(cell, x, y);

			const resource : Iresourcefinder = {
				id: cell.id,
				x: cell.x,
				y: cell.y,
				res_type: cell.resType,
				bonus: bonus,
				playerId: map_details?.playerId,
				player_name: map_details?.playerName,
				distance: distance,
				free: free
			};
			resources.push(resource);
		}

		// sort by distance, lowest on top
		resources.sort((a, b) => a.distance - b.distance);

		return {
			error: false,
			message: `${ resources.length } found`,
			data: resources
		};
	}

	discover_resources(map_data: any): any {
		const resources = [];
		for (let cell of map_data.map.cells) {
			switch (cell.resType) {
				case res_type.wood_1:
				case res_type.wood_2:
				case res_type.clay_1:
				case res_type.clay_2:
				case res_type.iron_1:
				case res_type.iron_2:
					resources.push(cell);
					break;
			}
		}
		return resources;
	}

	discover_oases(map_data: any): any {
		const oases = [];
		for (let cell of map_data.map.cells) {
			switch (cell.oasis)
			{
				case oasis_type.wood:
				case oasis_type.wood_1:
				case oasis_type.clay:
				case oasis_type.clay_1:
				case oasis_type.iron:
				case oasis_type.iron_1:
					oases.push(cell);
					break;
			}
		}
		return oases;
	}

	filter_type(resType: any, find_wood: boolean, find_clay: boolean, find_iron: boolean) {
		const is_wood = resType === res_type.wood_1 || resType === res_type.wood_2;
		const is_clay = resType === res_type.clay_1 || resType === res_type.clay_2;
		const is_iron = resType === res_type.iron_1 || resType === res_type.iron_2;
		return (!find_wood || !is_wood) && (!find_clay || !is_clay) && (!find_iron || !is_iron);
	}

	calculate_distance(village: any, x: number, y: number) {
		return Math.hypot(Number(village.x) - x, Number(village.y) - y);
	}

	calculate_bonus(cell: any, oases: any[]): number {
		const embassy_slots : number[] = [];
		for (let location_id of this.get_influence_area(Number(cell.x), Number(cell.y))) {

			const oasis = oases.find((oasis: any) => {
				return oasis.id == location_id;
			});
			if (!oasis)
				continue;

			switch (cell.resType) {
				case res_type.wood_1:
				case res_type.wood_2:
					if (oasis.oasis != oasis_type.wood &&
						oasis.oasis != oasis_type.wood_1) {
						continue;
					}
					break;

				case res_type.clay_1:
				case res_type.clay_2:
					if (oasis.oasis != oasis_type.clay &&
						oasis.oasis != oasis_type.clay_1) {
						continue;
					}
					break;

				case res_type.iron_1:
				case res_type.iron_2:
					if (oasis.oasis != oasis_type.iron &&
						oasis.oasis != oasis_type.iron_1) {
						continue;
					}
					break;
			}

			const resource_bonus = 25;
			if (embassy_slots.length < 3) {
				embassy_slots.push(resource_bonus);
				continue;
			}
			if (embassy_slots.length >= 3)
				break;
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

export default new resource_finder();
