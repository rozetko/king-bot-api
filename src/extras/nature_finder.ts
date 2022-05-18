import settings from '../settings';
import api from '../api';
import { village } from '../gamedata';
import { Inaturefinder, Imap_details, Ivillage } from '../interfaces';
import { find_state_data } from '../util';
import { nature_type, oasis_type } from '../data';

class nature_finder {

	async get_nature(
		village_id: number,
		nature_type: nature_type
	): Promise<any> {

		if (!nature_type) {
			return {
				error: true,
				message: 'please choose an animal!',
				data: null
			};
		}

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

		// find oasis
		const oasis: any = this.discover_oasis(map_data);

		// get map details
		let map_details: Imap_details = null;
		const params: Set<string> = new Set();
		for (let cell of oasis) {
			if (Number(cell.id) == 0) continue;
			params.add(village.map_details_ident + cell.id);
		}
		const map_details_data: any[] = await api.get_cache(Array.from(params));

		// filter and sort oasis with animals
		let nature = [];
		for (let cell of oasis) {
			map_details = find_state_data(village.map_details_ident + cell.id, map_details_data);
			if (!map_details)
				continue;

			if (!map_details.isOasis)
				continue;

			if (map_details.troops.units == null || Object.keys(map_details.troops.units).length == 0)
				continue;

			if (!Object.prototype.hasOwnProperty.call(map_details.troops.units, nature_type))
				continue;

			const crop : Inaturefinder = {
				id: cell.id,
				x: cell.x,
				y: cell.y,
				oasis_type: map_details.oasisType,
				nature: map_details.troops.units,
				distance: this.calculate_distance(cell, x, y)
			};
			nature.push(crop);
		}

		// sort by distance, lowest on top
		nature.sort((a, b) => a.distance - b.distance);

		return {
			error: false,
			message: `${ nature.length } found`,
			data: nature
		};
	}

	discover_oasis(map_data: any): any {
		const oasis = [];
		for (let cell of map_data.map.cells) {
			if (cell.oasis != '0')
				oasis.push(cell);
			/*
			switch (cell.oasis)
			{
				case oasis_type.wood_crop:
				case oasis_type.clay_crop:
				case oasis_type.iron_crop:
				case oasis_type.crop:
				case oasis_type.crop_double:
					oasis.push(cell);
					break;
			}*/
		}
		return oasis;
	}

	calculate_distance(village: any, x: number, y: number) {
		return Math.hypot(Number(village.x) - x, Number(village.y) - y);
	}
}

export default new nature_finder();
