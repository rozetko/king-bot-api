import { Ihero } from '../interfaces';
import { find_state_data } from '../util';
import { hero_status } from '../data';
import api from '../api';
import village from './village';

class hero {
	ident: string = 'Hero:';

	async get(): Promise<Ihero> {
		const villages_data: any = await village.get_own();
		const player_id: string = find_state_data(village.collection_own_ident, villages_data)[0].data.playerId;

		const params = [ this.ident + player_id ];

		const response: any[] = await api.get_cache(params);
		const hero_data: Ihero = find_state_data(this.ident + player_id, response);

		return hero_data;
	}

	get_hero_status(status: number): string {
		var values = Object.values(hero_status).filter((x) => Number.isNaN(Number(x)));
		var text = values[status].toString();
		if ([2,3,4].includes(Number(status)))
			return 'going ' + text.replace('_', ' ');
		return text;
	}
}

export default new hero();
