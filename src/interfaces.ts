import { tribe, hero_status, time_type, time_format } from './data';

export interface Ifarmlist {
	listId: number;
	listName: string;
	lastSent: number;
	lastChanged: Date;
	units: Ifarmlist_units;
	orderNr: number;
	villageIds: number[];
	entryIds: number[];
	isDefault: boolean;
	maxEntriesCount: number;
}

export interface Ifarmlist_entry {
	entryId: number;
	villageId: number;
	villageName: string;
	units: Ifarmlist_units;
	targetOwnerId: number;
	belongsToKing: number;
	population: number;
	coords: Icoordinates;
	isOasis: boolean;
	lastReport: {
		time: number;
		notificationType: number;
		raidedResSum: number;
		capacity: number;
		reportId: string;
	};
}

export interface Ifarmlist_units {
	[index: number]: number
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
}

export interface Iunits {
	[index: number]: number
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
	7: number;
	8: number;
	9: number;
	10: number;
	11: number;
}

export interface Icoordinates {
	[index: string]: number
	x: number;
	y: number;
}

export interface Ivillage {
	villageId: number;
	playerId: number;
	name: string;
	tribeId: tribe;
	belongsToKing: number;
	belongsToKingdom: number;
	type: number;
	population: number;
	coordinates: Icoordinates;
	isMainVillage: boolean;
	isTown: boolean;
	treasuresUseable: number;
	treasures: number;
	allowTributeCollection: number;
	protectionGranted: number;
	tributeCollectorPlayerId: number;
	realTributePercent: number;
	supplyBuildings: number;
	supplyTroops: number;
	production: Iresources;
	storage: Iresources;
	treasury: Iresources;
	storageCapacity: Iresources;
	usedControlPoints: number;
	availableControlPoints: number;
	culturePoints: number;
	celebrationType: number;
	celebrationEnd: number;
	culturePointProduction: number;
	treasureResourceBonus: number;
	acceptance: number;
	acceptanceProduction: number;
	tributes: Iresources;
	tributesCapacity: number;
	tributeTreasures: number;
	tributeProduction: number;
	tributeProductionDetail: number;
	tributeTime: number;
	tributesRequiredToFetch: number;
	estimatedWarehouseLevel: number;
	position: number;
}

export interface Ibuilding_collection {
	name: string
	data: Ibuilding
}

export interface Ibuilding {
	buildingType: number
	villageId: number
	locationId: number
	lvl: number
	lvlNext: number
	isMaxLvl: boolean
	lvlMax: number
	upgradeCosts: Iresources
	nextUpgradeCosts: { [index: number]: Iresources }
	upgradeTime: number
	nextUpgradeTimes: { [index: number]: number }
	upgradeSupplyUsage: number
	upgradeSupplyUsageSums: { [index: number]: number }
	category: number
	sortOrder: number
	rubble: [] // TODO implement
	rubbleDismantleTime: [] // TODO implement
	effect: number[]
}

export interface Ibuilding_queue {
	villageId: number
	tribeId: tribe
	freeSlots: {
		[index: number]: number
		1: number // buildings
		2: number // resources
		4: number
	}
	queues: {
		[index: number]: any[]
		1: any[] // buildings
		2: any[] // resources
		4: any[]
		5: any[]
	}
	canUseInstantConstruction: boolean
	canUseInstantConstructionOnlyInVillage: boolean
}

export interface Iresources {
	[index: number]: number
	1: number
	2: number
	3: number
	4: number
}

export interface Ihero {
	playerId: number;
	villageId: number;
	destVillageId: number;
	destVillageName: string;
	destPlayerName: string;
	destPlayerId: number;
	status: hero_status;
	health: number;
	lastHealthTime: number;
	baseRegenerationRate: number;
	regenerationRate: number;
	fightStrength: number;
	fightStrengthPoints: number;
	attBonusPoints: number;
	defBonusPoints: number;
	resBonusPoints: number;
	resBonusType: number;
	freePoints: number;
	speed: number;
	untilTime: number;
	bonuses: any;
	maxScrollsPerDay: number;
	scrollsUsedToday: number;
	waterbucketUsedToday: number;
	ointmentsUsedToday: number;
	adventurePointCardUsedToday: number;
	resourceChestsUsedToday: number;
	cropChestsUsedToday: number;
	artworkUsedToday: number;
	isMoving: boolean;
	adventurePoints: number;
	adventurePointTime: number;
	levelUp: number;
	xp: number;
	xpThisLevel: number;
	xpNextLevel: number;
	level: number;
}

export interface Iplayer {
	playerId: number,
	name: string,
	tribeId: tribe,
	kingdomId: number,
	kingdomTag: string,
	kingdomRole: number,
	isKing: false,
	kingId: number,
	kingstatus: number,
	villages: Ivillage[],
	population: number,
	active: boolean,
	prestige: number,
	level: number,
	stars: {
		bronzeBadge:number,
		bronze: number,
		silver: number,
		gold: number
	},
	nextLevelPrestige: number,
	hasNoobProtection: boolean,
	filterInformation: boolean,
	signupTime: number,
	vacationState: number,
	uiLimitations: number,
	gold: number,
	silver: number,
	deletionTime: number,
	coronationDuration: number,
	brewCelebration: number,
	uiStatus: number,
	hintStatus: number,
	spawnedOnMap: number,
	isActivated: boolean,
	isInstant: boolean,
	productionBonusTime: number,
	cropProductionBonusTime: number,
	premiumFeatureAutoExtendFlags: number,
	plusAccountTime: number,
	limitedPremiumFeatureFlags: number,
	lastPaymentTime: number,
	isPunished: boolean,
	limitationFlags: number,
	limitation: number,
	isBannedFromMessaging: boolean,
	bannedFromMessaging: number,
	questVersion: number,
	nextDailyQuestTime: number,
	dailyQuestsExchanged: number,
	avatarIdentifier: number,
	vacationStateStart: number,
	vacationStateEnd: number,
	usedVacationDays: number,
	halloweenBoostTime: number,
	winterPackageBoughtAmount: number
}

export interface Itarget {
	srcVillageId: number,
	srcVillageName: string,
	srcVillageTribe: tribe,
	srcVillageType: number,
	srcPlayerId: number,
	srcPlayerName: string,
	villageId: number,
	villageName: string,
	villageTribe: tribe,
	villageType: number,
	destPlayerId: number,
	destPlayerName: string,
	isOasis: number,
	isGovernorNPCVillage: boolean,
	isRobberVillage: boolean,
	isWorldWonderVillage: boolean,
	durations: Idurations,
	distance: number,
	ownVillage: boolean,
	warning: []
}

export interface Idurations {
	[index: number]: number
	1: number,
	2: number,
	3: number,
	4: number,
	5: number,
	6: number,
	7: number,
	8: number,
	9: number,
	10: number,
	11: number,
	101: number,
	102: number,
	103: number,
	104: number,
	105: number,
	106: number,
	107: number,
	108: number,
	109: number,
	110: number,
	111: number
}

export interface Imap_details {
	isOasis: boolean,
	oasisType: number,
	hasVillage: number,
	hasNPC: number,
	resType: number,
	isHabitable: number,
	landscape: number,
	npcInfo: Inpc_info,
	wwZone: number
}

export interface Inpc_info {
	villageId: number,
	name: string,
	type: number,
	playerId: number,
	tribeId: number,
	loot: Iresources,
	treasures: number,
	troops: Itroops
}

export interface Itroops_collection {
	name: string
	data: Itroops
}

export interface Itroops {
	troopId: number,
	tribeId: number,
	playerId: number,
	playerName: string,
	villageId: number,
	villageName: string,
	villageIdLocation: number,
	villageNameLocation: string,
	playerIdLocation: number,
	playerNameLocation: string,
	filter: string,
	villageIdSupply: number,
	status: string,
	units: [],
	supplyTroops: number,
	capacity: number,
	movement: Imovement
}

export interface Imovement {
	troopId: number,
	villageIdStart: number,
	villageIdTarget: number,
	playerIdTarget: number,
	coordinateID: number,
	timeStart: number,
	timeFinish: number,
	movementType: number,
	resources: Iresources,
	treasures: number,
	spyTarget: number,
	catapultTarget1: number,
	catapultTarget2: number,
	orderId: number,
	merchants: number
}

export interface Isettings {
	playerId: number,
	premiumConfirmation: number,
	lang: string,
	onlineStatusFilter: number,
	extendedSimulator: number,
	musicVolume: number,
	soundVolume: number,
	uiSoundVolume: number,
	muteAll: boolean,
	timeType: time_type,
	timeZone: number,
	timeZoneString: string,
	timeZoneSwitcher:number,
	timeFormat: time_format,
	attacksFilter: number,
	mapFilter: number,
	disableTabNotifications: number,
	enableTabNotifications: boolean,
	disableAnimations: boolean,
	notpadsVisible: boolean,
	disableHelpNotifications: true,
	enableHelpNotifications: boolean,
	enableWelcomeScreen: boolean,
	showPopulationWarning: boolean,
	showSeasonalTheme: boolean,
	showSnowfall: boolean
}