import Adventure from './adventure';
import SendFarmlist from './send_farmlist';
import BuildingQueue from './building_queue';
import RaiseFields from './raise_fields';
import TradeRoute from './trade_route';
import TimedSend from './timed_send';
import TrainTroops from './train_troops';
import ImproveTroops from './improve_troops';
import RobberHideouts from './robber_hideouts';
import Celebrations from './celebrations';

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
	timed_send: {
		navbar: true,
		component: TimedSend,
	},
	train_troops: {
		navbar: true,
		component: TrainTroops,
	},
	improve_troops: {
		navbar: true,
		component: ImproveTroops,
	},
	robber_hideouts: {
		navbar: true,
		component: RobberHideouts,
	},
	celebrations: {
		navbar: true,
		component: Celebrations,
	}
};

export default features;