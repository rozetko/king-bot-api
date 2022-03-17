import { log, find_state_data } from '../util';
import { Ifarmlist } from '../interfaces';
import api from '../api';
import logger from '../logger';

class farming {
	farmlist_ident: string = 'Collection:FarmList:';

	find(name: string, data: any): Ifarmlist {
		const lists = find_state_data(this.farmlist_ident, data);

		const farmlist = lists.find((x: any) => x.data.listName.toLowerCase() == name.toLowerCase());

		if (!farmlist) {
			logger.error(`couldn't find farmlist ${name}!`, 'farming');
			return null;
		}

		return farmlist.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([this.farmlist_ident]);
	}
}

export default new farming();
