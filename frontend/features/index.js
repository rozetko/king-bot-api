import Adventure from './adventure';
import SendFarmlist from './send_farmlist';
import BuildingQueue from './building_queue';
import RaiseFields from './raise_fields';
import TradeRoute from './trade_route';
import TimedAttack from './timed_attack';
import TrainTroops from './train_troops';

const features = {
	hero: {
		navbar: false,
		component: Adventure,
	},
	farming: {
		navbar: true,
		component: SendFarmlist,
	},
	queue: {
		navbar: true,
		component: BuildingQueue,
	},
	raise_fields: {
		navbar: true,
		component: RaiseFields,
	},
	trade_route: {
		navbar: true,
		component: TradeRoute,
	},
	timed_attack: {
		navbar: true,
		component: TimedAttack,
	},
	train_troops: {
		navbar: true,
		component: TrainTroops,
	}
};

export default features;
