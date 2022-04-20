import { find_state_data } from '../util';
import { Itroops_collection, Iunits } from '../interfaces';
import { troops_type, troops_status, default_Iunits } from '../data';
import api from '../api';

class troops {
	collection_ident: string = 'Collection:Troops:';
	collection_stationary_ident: string = this.collection_ident + 'stationary:';
	collection_moving_ident: string = this.collection_ident + 'moving:';
	collection_trapped_ident: string = this.collection_ident + 'trapped:';
	collection_elsewhere_ident: string = this.collection_ident + 'elsewhere:';

	async get(village_id: number, type: troops_type): Promise<Itroops_collection[]> {

		let params: string[] = [];
		switch (type) {
			case troops_type.stationary:
				params.push(this.collection_stationary_ident + village_id);
				break;
			case troops_type.moving:
				params.push(this.collection_moving_ident + village_id);
				break;
			case troops_type.trapped:
				params.push(this.collection_trapped_ident + village_id);
				break;
			case troops_type.elsewhere:
				params.push(this.collection_elsewhere_ident + village_id);
				break;
		}
		const response = await api.get_cache(params);
		const troops_data: Itroops_collection[] = find_state_data(params[0], response);

		return troops_data;
	}

	async get_units(village_id: number, type: troops_type, status: troops_status): Promise<Iunits> {
		const troops_collection: Itroops_collection[] = await this.get(village_id, type);
		if (troops_collection)
			for (let troop of troops_collection) {
				if (troop.data.status == status) {
					return troop.data.units;
				}
			}
		return default_Iunits;
	}
}

export default new troops();