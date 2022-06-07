export enum adventure_type {
	short = 0,
	long = 1
}

export enum hero_status {
	idle = 0,
	returning = 1,
	to_village = 2,
	to_oasis = 3,
	to_adventure = 4,
	supporting = 5,
	trapped = 6,
	dead = 7,
	reviving = 8
}

export enum hero_item_types {
	helmet1_1 = 5,
	helmet4_0 = 13,
	sword2_0 = 22,
	sword2_2 = 24,
	sword3_2 = 27,
	lance0_2 = 30,
	map0_0 = 61,
	map0_2 = 63,
	flag1_0 = 67,
	telescope0_0 = 70,
	sack0_0 = 73,
	horn0_0 = 79,
	shirt1_0 = 85,
	shirt1_2 = 87,
	shoes0_0 = 94,
	shoes1_0 = 97,
	shoes2_0 = 100,
	horse2_2 = 108,
	horse0_0 = 109,
	ointment = 112,
	scroll = 113,
	water_bucket = 114,
	book = 115,
	artwork = 116,
	small_bandage = 117,
	bandage = 118,
	cage = 119,
	treasures = 120,
	shoes3_0 = 121,
	healing_potion = 124,
	upgrade_armor = 125,
	upgrade_weapon = 126,
	upgrade_accessory = 127,
	upgrade_helmet = 128,
	upgrade_shoes = 129,
	resourceChest3 = 130,
	resourceChest4 = 131,
	resourceChest5 = 132,
	cropChest3 = 133,
	cropChest4 = 134,
	cropChest5 = 135,
	instantDelivery = 140,
	upgraded_small_bandage = 141,
	upgraded_bandage = 142,
	resourcesCropM = 153
}

export enum tribe {
	roman = '1',
	teuton = '2',
	gaul = '3',
	nature = '4',
	natars = '5'
}

export enum mission_types {
	attack = 3,
	raid = 4,
	support = 5,
	spy = 6,
	siege = 47,
	settle = 10
}

export enum time_type {
	utc = 0,
	local_time = 1,
	gameworld_time = 2
}

export enum time_format {
	default = 0,
	us = 1,
	uk = 2,
	iso = 3
}

export enum troops_status {
	home = 'home',
	support = 'support'
}

export enum troops_type {
	stationary = 0,
	moving = 1,
	trapped = 2,
	elsewhere = 3
}

export enum celebration_types {
	small = 1,
	large = 2,
	brewery = 3,
	teahouse = 4
}

export const default_Iunits = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0 };

export enum res_type {
	default = '4446',
	wood_1 = '5436',
	wood_2 = '5346',
	clay_1 = '4536',
	clay_2 = '3546',
	iron_1 = '4356',
	iron_2 = '3456',
	c7_1 = '4347',
	c7_2 = '4437',
	c7_3 = '3447',
	c9 = '3339',
	c15 = '11115'
}

export enum oasis_type {
	wood = '10',
	wood_1 = '11',
	clay = '20',
	clay_1 = '21',
	iron = '30',
	iron_1 = '31',
	crop = '40',
	crop_1 = '41'
}

export enum nature_type {
	rat = '1',
	spider = '2',
	snake = '3',
	bat = '4',
	boar = '5',
	wolf = '6',
	bear = '7',
	crocodile = '8',
	tiger = '9',
	elephant = '10',
}

export const building_types: { [index: number]: string } = {
	1: 'wood',
	2: 'clay',
	3: 'iron',
	4: 'crop',
	5: 'sawmill',
	6: 'brickyard',
	7: 'iron foundry',
	8: 'grain mill',
	9: 'bakery',
	10: 'warehouse',
	11: 'granary',
	12: '',
	13: 'smithy',
	14: 'tournament square',
	15: 'main building',
	16: 'rally point',
	17: 'marketplace',
	18: 'embassy',
	19: 'barracks',
	20: 'stable',
	21: 'workshop',
	22: 'academy',
	23: 'cranny',
	24: 'town hall',
	25: 'residence',
	26: 'palace',
	27: 'treasury',
	28: 'trade office',
	29: 'great barracks',
	30: 'great stable',
	31: 'city wall',
	32: 'earth wall',
	33: 'palisade',
	34: 'stonemasons lodge',
	35: 'brewery',
	36: 'trapper',
	37: '',
	38: 'great warehouse',
	39: 'great granary',
	40: 'world of wonder',
	41: 'horse drinking trough',
	42: 'water ditch',
	43: 'natarian wall',
	44: '',
	45: 'hidden treasury'
};

export const unit_types: any = {
	// roman units
	1: {
		1: {
			unit_type: 1,
			name: 'Legionnaire',
			attack: 40,
			speed: 6,
			infantry_defense: 35,
			calvary_defense: 50,
			carry_capacity: 50,
			costs: [ 75, 50, 100, 0	]
		},
		2: {
			unit_type: 2,
			name: 'Praetorian',
			attack: 30,
			speed: 5,
			infantry_defense: 65,
			calvary_defense: 35,
			carry_capacity: 20,
			costs: [ 80, 100, 160, 0 ]
		},
		3: {
			unit_type: 3,
			name: 'Imperian',
			attack: 70,
			speed: 7,
			infantry_defense: 40,
			calvary_defense: 25,
			carry_capacity: 50,
			costs: [ 100, 110, 140, 0 ]
		},
		4: {
			unit_type: 4,
			name: 'Equites Legati',
			attack: 0,
			speed: 16,
			infantry_defense: 20,
			calvary_defense: 10,
			carry_capacity: 0,
			costs: [ 100, 140, 10, 0 ]
		},
		5: {
			unit_type: 5,
			name: 'Equites Imperatoris',
			attack: 120,
			speed: 14,
			infantry_defense: 65,
			calvary_defense: 50,
			carry_capacity: 100,
			costs: [ 350, 260, 180,	0 ]
		},
		6: {
			unit_type: 6,
			name: 'Equites Caesaris',
			attack: 180,
			speed: 10,
			infantry_defense: 80,
			calvary_defense: 105,
			carry_capacity: 70,
			costs: [ 280, 340, 600, 0 ]
		},
		7: {
			unit_type: 7,
			name: 'Battering Ram',
			attack: 60,
			speed: 4,
			infantry_defense: 30,
			calvary_defense: 75,
			carry_capacity: 0,
			costs: [ 700, 180, 400,	0 ]
		},
		8: {
			unit_type: 8,
			name: 'Fire Catapult',
			attack: 75,
			speed: 3,
			infantry_defense: 60,
			calvary_defense: 10,
			carry_capacity: 0,
			costs: [ 690, 1000, 400, 0 ]
		},
		9: {
			unit_type: 9,
			name: 'Senator',
			attack: 50,
			speed: 4,
			infantry_defense: 40,
			calvary_defense: 30,
			carry_capacity: 0,
			costs: [ 30750,	27200, 45000, 0 ]
		},
		10: {
			unit_type: 10,
			name: 'Settler',
			attack: 0,
			speed: 5,
			infantry_defense: 80,
			calvary_defense: 80,
			carry_capacity: 3000,
			costs: [ 3500, 3000, 4500, 0 ]
		},
	},
	// teuton units
	2: {
		1: {
			unit_type: 11,
			name: 'Clubswinger',
			attack: 40,
			speed: 7,
			infantry_defense: 20,
			calvary_defense: 5,
			carry_capacity: 60,
			costs: [ 85, 65, 30, 0 ]
		},
		2: {
			unit_type: 12,
			name: 'Spearfighter',
			attack: 10,
			speed: 7,
			infantry_defense: 35,
			calvary_defense: 60,
			carry_capacity: 40,
			costs: [ 125, 50, 65, 0 ]
		},
		3: {
			unit_type: 13,
			name: 'Axefighter',
			attack: 60,
			speed: 7,
			infantry_defense: 30,
			calvary_defense: 30,
			carry_capacity: 50,
			costs: [ 80, 65, 130, 0 ]
		},
		4: {
			unit_type: 14,
			name: 'Scout',
			attack: 0,
			speed: 10,
			infantry_defense: 10,
			calvary_defense: 5,
			carry_capacity: 0,
			costs: [ 140, 80, 30, 0 ]
		},
		5: {
			unit_type: 15,
			name: 'Paladin',
			attack: 55,
			speed: 10,
			infantry_defense: 100,
			calvary_defense: 40,
			carry_capacity: 110,
			costs: [ 330, 170, 200,	0 ]
		},
		6: {
			unit_type: 16,
			name: 'Teutonic Knight',
			attack: 150,
			speed: 9,
			infantry_defense: 50,
			calvary_defense: 75,
			carry_capacity: 80,
			costs: [ 350, 400, 320,	0 ]
		},
		7: {
			unit_type: 17,
			name: 'Ram',
			attack: 65,
			speed: 4,
			infantry_defense: 30,
			calvary_defense: 80,
			carry_capacity: 0,
			costs: [ 800, 150, 250, 0 ]
		},
		8: {
			unit_type: 18,
			name: 'Catapult',
			attack: 50,
			speed: 3,
			infantry_defense: 60,
			calvary_defense: 10,
			carry_capacity: 0,
			costs: [ 660, 900, 370, 0 ]
		},
		9: {
			unit_type: 19,
			name: 'Chief',
			attack: 40,
			speed: 4,
			infantry_defense: 60,
			calvary_defense: 40,
			carry_capacity: 0,
			costs: [ 35500, 26600, 25000, 0	]
		},
		10: {
			unit_type: 20,
			name: 'Settler',
			attack: 0,
			speed: 5,
			infantry_defense: 80,
			calvary_defense: 80,
			carry_capacity: 3000,
			costs: [ 4000, 3500, 3200, 0 ]
		}
	},
	// gaul units
	3: {
		1: {
			unit_type: 21,
			name: 'Phalanx',
			attack: 15,
			speed: 7,
			infantry_defense: 40,
			calvary_defense: 50,
			carry_capacity: 35,
			costs: [ 85, 100, 50, 0	]
		},
		2: {
			unit_type: 22,
			name: 'Swordsman',
			attack: 65,
			speed: 6,
			infantry_defense: 35,
			calvary_defense: 20,
			carry_capacity: 45,
			costs: [ 95, 60, 140, 0 ]
		},
		3: {
			unit_type: 23,
			name: 'Pathfinder',
			attack: 0,
			speed: 17,
			infantry_defense: 20,
			calvary_defense: 10,
			carry_capacity: 0,
			costs: [ 140, 110, 20, 0 ]
		},
		4: {
			unit_type: 24,
			name: 'Theutates Thunder',
			attack: 90,
			speed: 19,
			infantry_defense: 25,
			calvary_defense: 40,
			carry_capacity: 75,
			costs: [ 200, 280, 130, 0 ]
		},
		5: {
			unit_type: 25,
			name: 'Druidrider',
			attack: 45,
			speed: 16,
			infantry_defense: 115,
			calvary_defense: 55,
			carry_capacity: 35,
			costs: [ 300, 270, 190, 0 ]
		},
		6: {
			unit_type: 26,
			name: 'Haeduan',
			attack: 140,
			speed: 13,
			infantry_defense: 60,
			calvary_defense: 165,
			carry_capacity: 65,
			costs: [ 300, 380, 440, 0 ]
		},
		7: {
			unit_type: 27,
			name: 'Ram',
			attack: 50,
			speed: 4,
			infantry_defense: 30,
			calvary_defense: 105,
			carry_capacity: 0,
			costs: [ 750, 370, 220, 0 ]
		},
		8: {
			unit_type: 28,
			name: 'Trebuchet',
			attack: 70,
			speed: 3,
			infantry_defense: 45,
			calvary_defense: 10,
			carry_capacity: 0,
			costs: [ 590, 1200, 400, 0 ]
		},
		9: {
			unit_type: 29,
			name: 'Chieftain',
			attack: 40,
			speed: 5,
			infantry_defense: 50,
			calvary_defense: 50,
			carry_capacity: 0,
			costs: [ 30750,	45400, 31000, 0 ]
		},
		10: {
			unit_type: 30,
			name: 'Settler',
			attack: 0,
			speed: 5,
			infantry_defense: 80,
			calvary_defense: 80,
			carry_capacity: 3000,
			costs: [ 3000, 4000, 3000, 0 ]
		}
	}
};
