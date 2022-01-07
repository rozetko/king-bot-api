import { Itroops_collection } from '../interfaces';
import { find_state_data } from '../util';
import api from '../api';

class troops {
	collection_ident: string = 'Collection:Troops:';
	collection_stationary_ident: string = this.collection_ident + 'stationary:';
	collection_moving_ident: string = this.collection_ident + 'moving:';
	collection_trapped_ident: string = this.collection_ident + 'trapped:';
	collection_elsewhere_ident: string = this.collection_ident + 'elsewhere:';

	async get(village_id: number, status: troops_status): Promise<Itroops_collection[]> {

		let params: string[] = [];
		switch (status) {
			case troops_status.stationary:
				params.push(this.collection_stationary_ident + village_id);
				break;
			case troops_status.moving:
				params.push(this.collection_moving_ident + village_id);
				break;
			case troops_status.trapped:
				params.push(this.collection_trapped_ident + village_id);
				break;
			case troops_status.elsewhere:
				params.push(this.collection_elsewhere_ident + village_id);
				break;
		}
		const response = await api.get_cache(params);
		const troops_data: Itroops_collection[] = find_state_data(params[0], response);

		return troops_data;
	}
}

export enum troops_status {
	stationary = 0,
	moving = 1,
	trapped = 2,
	elsewhere = 3
}

export default new troops();