import { find_state_data } from '../util';
import { Ivillage, Ibuilding_collection, Ibuilding } from '../interfaces';
import api from '../api';
import logger from '../logger';

class village {
	ident: string = 'Village:';
	collection_ident: string = 'Collection:Village:';
	collection_own_ident: string = this.collection_ident + 'own';

	building_collection_ident: string = 'Collection:Building:';
	building_ident: string = 'Building:';
	building_queue_ident: string = 'BuildingQueue:';

	map_details_ident: string = 'MapDetails:';

	find(id: number, data: any): Ivillage {
		const villages = find_state_data(this.collection_own_ident, data);
		if (!villages) {
			logger.error('couldn\'t get own villages data!', 'village');
			return null;
		}
		const village = villages.find((x: any) => x.data.villageId == id);

		if (!village) {
			logger.error(`couldn't find village with id: ${id}!`, 'village');
			return null;
		}

		return village.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([this.collection_own_ident]);
	}

	async get_building(id: number, building_type: number): Promise<Ibuilding> {

		// get building collection
		let params: string[] = [];
		params.push(this.building_collection_ident + id);
		const response = await api.get_cache(params);
		const building_collection: Ibuilding_collection[] =
			find_state_data(this.building_collection_ident + id, response);

		// get building data
		let building_data: Ibuilding = null;
		for (let building of building_collection) {
			const bd: Ibuilding = building.data;
			if (bd.buildingType != building_type)
				continue;
			building_data = bd;
			break;
		}
		return building_data;
	}
}

export default new village();
