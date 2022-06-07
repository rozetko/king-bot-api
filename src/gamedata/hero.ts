import { Ihero, Ihero_item_collection } from '../interfaces';
import { find_state_data } from '../util';
import { hero_status } from '../data';
import api from '../api';
import village from './village';

class hero {
	ident: string = 'Hero:';
	collection_item_ident: string = 'Collection:HeroItem:own';

	async get(): Promise<Ihero> {
		const villages_data: any = await village.get_own();
		if (!villages_data)
			return null;
		const villages: any = find_state_data(village.collection_own_ident, villages_data);
		if (!villages)
			return null;
		const player_id: string = villages[0]?.data?.playerId;

		const hero_data: any[] = await api.get_cache([ this.ident + player_id ]);
		if (!hero_data)
			return null;
		const hero: Ihero = find_state_data(this.ident + player_id, hero_data);
		return hero;
	}

	async get_hero_items(): Promise<Ihero_item_collection[]> {
		const hero_items_data: any[] = await api.get_cache([ this.collection_item_ident ]);
		if (!hero_items_data)
			return null;
		const hero_items: Ihero_item_collection[] = find_state_data(this.collection_item_ident, hero_items_data);
		return hero_items;
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
