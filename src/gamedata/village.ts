import { log, find_state_data } from '../util';
import { Ivillage } from '../interfaces';
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

		const village = villages.find((x: any) => x.data.villageId == id);

		if (!village) {
			logger.error(`couldn't find village with ID: ${id}!`, 'village');
			return null;
		}

		return village.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([this.collection_own_ident]);
	}
}

export default new village();
