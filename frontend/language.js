import axios from 'axios';

const languages = {
	en: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_add_feature: 'add feature',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'easy scout',
		lang_navbar_inactive_finder: 'inactive finder',
		lang_navbar_logger: 'logs',
		lang_navbar_change_login: 'change login',
		lang_navbar_language: 'language',
		lang_navbar_search: 'search features',

		lang_feature_finish_earlier: 'instant finish',
		lang_feature_hero: 'auto adventure',
		lang_feature_farming: 'send farmlists',
		lang_feature_queue: 'building queue',
		lang_feature_raise_fields: 'raise fields',
		lang_feature_trade_route: 'trade route',
		lang_feature_timed_send: 'timed send',
		lang_feature_train_troops: 'train troops',
		lang_feature_robber_hideouts: 'robber hideouts',
		lang_feature_improve_troops: 'improve troops',

		lang_feature_desc_hero: 'sends the hero automaticly on an adventure if the health is above given percentage.',
		lang_feature_desc_queue: 'this is an endless building queue. don\'t change the village once it\'s set, if you want to change the village, just do another building queue feature with your desired village.',
		lang_feature_desc_raise_fields: 'will raise all your fields to a given level on it\'s own, it will always upgrade the type which got the lowest storage.',
		lang_feature_desc_farming: 'will just send the farmlist in a given interval.',
		lang_feature_desc_trade_route: 'sends merchants from the origin village to the desination at a given interval.',
		lang_feature_desc_timed_send: 'send troops at a scheduled time, consider the travel time of the units for the arrival time.',
		lang_feature_desc_train_troops: 'train troops in a given interval and order, it goes through the entire list at each interval, if the amount is greater than the cost of the available resources, it will train as many troops as possible.',
		lang_feature_desc_robber_hideouts: 'check for robber hideouts and send the given units to attack them, it will retry with the same hideout until its destroyed, and then it will move on to the next and so on.',
		lang_feature_desc_improve_troops: 'checks if it can upgrade given units in given order, first it checks unit and if it is not available or is maxed out, it will try to upgrade the next unit, you can increase the list as long as you want to.',

		lang_home_name: 'feature name',
		lang_home_description: 'description',
		lang_home_status: 'status',
		lang_home_off_on: 'off / on',
		lang_home_options: 'options',
		lang_home_not_configured: '<not configured>',

		lang_easy_scout_title: 'easy scout',
		lang_easy_scout_description: 'send scouts to every farm in the given farmlist',

		lang_combo_box_farmlist: 'select farmlist',
		lang_combo_box_village: 'select village',
		lang_combo_box_unittype: 'select unit',
		lang_combo_box_level: 'select level',
		lang_combo_box_missiontype: 'mission type',

		lang_label_spy_for: 'spy for',
		lang_label_ressources: 'resources',
		lang_label_defence: 'defence',

		lang_table_farmlist: 'farmlist',
		lang_table_village: 'village',
		lang_table_remove: 'remove',
		lang_table_duration: 'duration',
		lang_table_distance: 'distance',
		lang_table_population: 'population',
		lang_table_coordinates: 'coordinates',
		lang_table_player: 'player',
		lang_table_kingdom: 'kingdom',
		lang_table_tribe: 'tribe',
		lang_table_id: 'id',
		lang_table_name: 'name',
		lang_table_lvl: 'lvl',
		lang_table_pos: 'pos',
		lang_table_unittype: 'unit',
		lang_table_level: 'level',
		lang_table_amount: 'amount',
		lang_table_options: 'options',

		lang_button_submit: 'submit',
		lang_button_cancel: 'cancel',
		lang_button_delete: 'delete',
		lang_button_search: 'search',

		lang_adventure_adventure_type: 'adventure type',
		lang_adventure_short: 'short',
		lang_adventure_long: 'long',
		lang_adventure_min_health: 'minimum health',
		lang_adventure_max: 'max',
		lang_adventure_health: 'health',

		lang_finish_earlier_description: '5 min earlier',

		lang_queue_res_fields: 'resource fields',
		lang_queue_buildings: 'buildings',
		lang_queue_queue: 'queue',

		lang_farmlist_add: 'add farmlist',
		lang_farmlist_losses: 'move farms with losses to',

		lang_robber_hideouts_registered: 'robbers registered',
		lang_robber_hideouts_button_setrobbers: 'set robbers',
		lang_robber_hideouts_help_default: 'fill x and y coordinates from any robber hideout',
		lang_robber_hideouts_help_error_wrong: 'error: not a robber hideout',
		lang_robber_hideouts_help_error_find: 'error: unable to find robber hideout!',
		lang_robber_hideouts_help_success: 'successfully registered robber hideouts!',

		lang_timed_send_arrival: 'arrival date / time',
		lang_timed_send_button_settarget: 'set target',
		lang_timed_send_error_arrival_duration: 'error: travel duration time exceeds arrival',
		lang_timed_send_help_error_wrong: 'something went wrong, is your target a robber?',

		lang_finder_default: 'default',
		lang_finder_name: 'inactive finder',
		lang_finder_distance_to: 'distance relative to',
		lang_finder_player_pop: 'player pop (min / max)',
		lang_finder_village_pop: 'village pop (min / max)',
		lang_finder_distance: 'distance (min / max)',
		lang_finder_add_list: 'add to farmlist',
		lang_finder_inactive_for: 'inactive for',
		lang_finder_days: 'days',
		lang_finder_description: 'searches for inactive players and displays their villages based on distance, once you added them to your farmlist, you can use the easy scout feature to spy them.',

		lang_log_level: 'level',
		lang_log_group: 'group',
		lang_log_message: 'message',
		lang_log_timestamp: 'time',

		lang_login_title: 'login',
		lang_login_change_login: 'change login',
		lang_login_start: 'start',
		lang_login_reconnect: 'reconnect to',
		lang_login_relogin: 'or % with another account',
		lang_login_relogin_button: 'login',
		lang_login_info: 'if the app shuts down you might have enterd wrong credentials. you should restart and login again.',
		lang_login_notification: 'the bot is going to shut down.... restart it, so the changes take effect.',
		lang_login_reset_features: 'this will reset all features you configured!',
		lang_login_gameworld: 'gameworld',
		lang_login_email: 'email',
		lang_login_password: 'password',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(optional)',
		lang_login_sitter_description: 'if you play as a sitter or dual we need the ingame name to identify the correct gameworld id',
		lang_login_ingame_name: 'ingame name (only when sitter or dual)',

		lang_trade_source_village: 'select source village',
		lang_trade_dest_village: 'select destination village',
		lang_trade_send_ress: 'send (wood|clay|iron|crop)',
		lang_trade_source_greater: 'when source is greater than (wood|clay|iron|crop)',
		lang_trade_dest_less: 'and destination is less than (wood|clay|iron|crop)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'provide a number',
		lang_common_amount: 'amount',
		lang_common_level: 'level',
		lang_common_wood: 'wood',
		lang_common_clay: 'clay',
		lang_common_iron: 'iron',
		lang_common_crop: 'crop',
		lang_common_interval: 'interval in seconds (min / max)',
		lang_common_target: 'target (x / y)',
		lang_common_add_unit: 'add unit',
		lang_common_add_edit: 'edit unit',

		lang_mission_type_support: 'reinforcement',
		lang_mission_type_attack: 'attack',
		lang_mission_type_raid: 'raid',
		lang_mission_type_spy: 'scouting',
		lang_mission_type_siege: 'siege',
		lang_mission_type_settle: 'settle',

		lang_unit_types_hero: 'hero',
		lang_unit_types: {
			1: {
				1: 'legionnaire',
				2: 'praetorian',
				3: 'imperian',
				4: 'equites legati',
				5: 'equites imperatoris',
				6: 'equites caesaris',
				7: 'battering ram',
				8: 'fire catapult',
				9: 'senator',
				10: 'settler'
			},
			2: {
				1: 'clubswinger',
				2: 'spearfighter',
				3: 'axefighter',
				4: 'scout',
				5: 'paladin',
				6: 'teutonic knight',
				7: 'ram',
				8: 'catapult',
				9: 'chief',
				10: 'settler'
			},
			3: {
				1: 'phalanx',
				2: 'swordsman',
				3: 'pathfinder',
				4: 'theutates thunder',
				5: 'druidrider',
				6: 'haeduan',
				7: 'ram',
				8: 'trebuchet',
				9: 'chieftain',
				10: 'settler'
			}
		},

		lang_building_types: {
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
		}
	},
	es: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_add_feature: 'añadir función',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'espionaje',
		lang_navbar_inactive_finder: 'buscar inactivos',
		lang_navbar_logger: 'logs',
		lang_navbar_change_login: 'cambiar login',
		lang_navbar_language: 'idioma',
		lang_navbar_search: 'buscar funciones',

		lang_feature_finish_earlier: 'finalizar instantáneo',
		lang_feature_hero: 'auto aventura',
		lang_feature_farming: 'enviar lista de vacas',
		lang_feature_queue: 'cola de construcción',
		lang_feature_raise_fields: 'subir recursos',
		lang_feature_trade_route: 'ruta comercial',
		lang_feature_timed_send: 'envío programado',
		lang_feature_train_troops: 'entrenar tropas',
		lang_feature_robber_hideouts: 'escondites de ladrones',
		lang_feature_improve_troops: 'mejorar tropas',

		lang_feature_desc_hero: 'envía al héroe automáticamente a una aventura si la salud está por encima del porcentaje dado.',
		lang_feature_desc_queue: 'esta es una cola de construcción interminable, no cambies la aldea una vez que esté establecida, si quieres cambiar la aldea, simplemente crea otra función de cola de construcción con tu aldea deseada.',
		lang_feature_desc_raise_fields: 'subirá todos tus recursos a un nivel determinado automáticamente, siempre actualizará el tipo que tenga el almacenamiento más bajo.',
		lang_feature_desc_farming: 'se limitará a enviar la lista de vacas en un intervalo determinado.',
		lang_feature_desc_trade_route: 'envía a los comerciantes de la aldea de origen a la de destino en un intervalo determinado.',
		lang_feature_desc_timed_send: 'enviar tropas a una hora programada, considera la duración del viaje de las unidades para la hora de llegada.',
		lang_feature_desc_train_troops: 'entrenar tropas en un intervalo y orden determinado, recorre toda la lista en cada intervalo, si la cantidad es mayor que el coste de los recursos disponibles, entrenará las tropas posibles.',
		lang_feature_desc_robber_hideouts: 'comprueba los escondites de los ladrones y envía las unidades dadas para atacarlos, volverá a intentar con el mismo escondite hasta que sea destruido, y entonces pasará al siguiente y así sucesivamente.',
		lang_feature_desc_improve_troops: 'comprueba si puede mejorar las unidades dadas en un orden determinado, primero comprueba la unidad y si no está disponible o está al máximo, intentará mejorar la siguiente unidad, puedes aumentar la lista tanto como quieras.',

		lang_home_name: 'nombre función',
		lang_home_description: 'descripción',
		lang_home_status: 'estado',
		lang_home_off_on: 'off / on',
		lang_home_options: 'opciones',
		lang_home_not_configured: '<no configurada>',

		lang_easy_scout_title: 'espionaje',
		lang_easy_scout_description: 'envia exploradores a todas las vacas de una lista de vacas determinada.',

		lang_combo_box_farmlist: 'seleccionar lista de vacas',
		lang_combo_box_village: 'seleccionar aldea',
		lang_combo_box_unittype: 'seleccionar unidad',
		lang_combo_box_level: 'seleccionar nivel',
		lang_combo_box_missiontype: 'tipo de misión',

		lang_label_spy_for: 'espiar para',
		lang_label_ressources: 'recursos',
		lang_label_defence: 'defensa',

		lang_table_farmlist: 'lista de vacas',
		lang_table_village: 'aldea',
		lang_table_remove: 'eliminar',
		lang_table_duration: 'duración',
		lang_table_distance: 'distancia',
		lang_table_population: 'población',
		lang_table_coordinates: 'coordenadas',
		lang_table_player: 'jugador',
		lang_table_kingdom: 'reino',
		lang_table_tribe: 'tribu',
		lang_table_id: 'id',
		lang_table_name: 'nombre',
		lang_table_lvl: 'nivel',
		lang_table_pos: 'pos',
		lang_table_unittype: 'unidad',
		lang_table_level: 'nivel',
		lang_table_amount: 'cantidad',
		lang_table_options: 'opciones',

		lang_button_submit: 'guardar',
		lang_button_cancel: 'cancelar',
		lang_button_delete: 'eliminar',
		lang_button_search: 'buscar',

		lang_adventure_adventure_type: 'tipo de aventura',
		lang_adventure_short: 'corta',
		lang_adventure_long: 'larga',
		lang_adventure_min_health: 'salud mínima',
		lang_adventure_max: 'máx.',
		lang_adventure_health: 'salud',

		lang_finish_earlier_description: '5 minutos antes',

		lang_queue_res_fields: 'campos de recursos',
		lang_queue_buildings: 'edificios',
		lang_queue_queue: 'cola de construcción',

		lang_farmlist_add: 'añadir lista',
		lang_farmlist_losses: 'mover vacas con perdidas a',

		lang_robber_hideouts_registered: 'ladrones registrados',
		lang_robber_hideouts_button_setrobbers: 'registrar',
		lang_robber_hideouts_help_default: 'rellena las coordenadas x e y de cualquier escondite',
		lang_robber_hideouts_help_error_wrong: 'error: no es un escondite de ladrones',
		lang_robber_hideouts_help_error_find: 'error: imposible encontrar escondite de ladrones',
		lang_robber_hideouts_help_success: '¡escondite de ladrones registrados con éxito!',

		lang_timed_send_arrival: 'fecha / hora de llegada',
		lang_timed_send_button_settarget: 'registrar',
		lang_timed_send_error_arrival_duration: 'error: la duración del viaje es superior a la de la llegada',
		lang_timed_send_help_error_wrong: 'algo salió mal, ¿tu objetivo es un ladrón?',

		lang_finder_default: 'pred',
		lang_finder_name: 'buscador de inactivos',
		lang_finder_distance_to: 'distancia relativa a',
		lang_finder_player_pop: 'población jugador (mín. / máx.)',
		lang_finder_village_pop: 'población aldea (mín. / máx.)',
		lang_finder_distance: 'distancia (mín. / máx.)',
		lang_finder_add_list: 'añadir a lista de vacas',
		lang_finder_inactive_for: 'inactivo durante',
		lang_finder_days: 'días',
		lang_finder_description: 'busca a los jugadores inactivos y muestra sus aldeas en función de la distancia, una vez que los hayas añadido a tu lista de vacas, puedes espiarlos fácilmente con la función de espionaje.',

		lang_log_level: 'nivel',
		lang_log_group: 'grupo',
		lang_log_message: 'mensaje',
		lang_log_timestamp: 'tiempo',

		lang_login_title: 'iniciar sesión',
		lang_login_change_login: 'cambiar login',
		lang_login_start: 'iniciar',
		lang_login_reconnect: 'reconectar a',
		lang_login_relogin: 'o % con otra cuenta',
		lang_login_relogin_button: 'inicia sesión',
		lang_login_info: 'si la aplicación se cierra, es posible que hayas introducido unas credenciales incorrectas, debes reiniciar y volver a iniciar sesión.',
		lang_login_notification: 'el bot se va a apagar.... reinícialo, para que los cambios surtan efecto.',
		lang_login_reset_features: '¡esto restablecerá todas las funciones que hayas configurado!',
		lang_login_gameworld: 'mundo de juego',
		lang_login_email: 'correo electrónico',
		lang_login_password: 'contraseña',
		lang_login_sitter_dual: 'representante / dual ?',
		lang_login_optional: '(opcional)',
		lang_login_sitter_description: 'si juegas como representante o dual necesitamos el nombre en el juego para identificar el id correcto del mundo de juego',
		lang_login_ingame_name: 'nombre en el juego (sólo cuando se trata de un representante o de un dual)',

		lang_trade_source_village: 'seleccionar aldea de origen',
		lang_trade_dest_village: 'seleccionar aldea de destino',
		lang_trade_send_ress: 'enviar (madera|barro|hierro|cereal)',
		lang_trade_source_greater: 'cuando el origen es mayor que (madera|barro|hierro|cereal)',
		lang_trade_dest_less: 'y el destino es inferior a (madera|barro|hierro|cereal)',

		lang_common_min: 'mín.',
		lang_common_max: 'máx.',
		lang_common_prov_number: 'proporcionar un número',
		lang_common_amount: 'cantidad',
		lang_common_level: 'nivel',
		lang_common_wood: 'madera',
		lang_common_clay: 'barro',
		lang_common_iron: 'hierro',
		lang_common_crop: 'cereal',
		lang_common_interval: 'intervalo en segundos (mín. / máx.)',
		lang_common_target: 'objetivo (x / y)',
		lang_common_add_unit: 'añadir',
		lang_common_add_edit: 'editar',

		lang_mission_type_support: 'refuerzo',
		lang_mission_type_attack: 'ataque',
		lang_mission_type_raid: 'saquear',
		lang_mission_type_spy: 'acecho',
		lang_mission_type_siege: 'asedio',
		lang_mission_type_settle: 'colonizar',

		lang_unit_types_hero: 'héroe',
		lang_unit_types: {
			1: {
				1: 'legionario',
				2: 'pretoriano',
				3: 'imperano',
				4: 'equites legati',
				5: 'equites imperatoris',
				6: 'equites caesaris',
				7: 'ariete romano',
				8: 'catapulta de fuego',
				9: 'senador',
				10: 'colono'
			},
			2: {
				1: 'guerrero de porra',
				2: 'lancero',
				3: 'guerrero de hacha',
				4: 'explorador',
				5: 'paladín',
				6: 'caballero teutón',
				7: 'ariete germano',
				8: 'catapulta',
				9: 'cabecilla',
				10: 'colono'
			},
			3: {
				1: 'falange',
				2: 'guerrero de espada',
				3: 'rastreador',
				4: 'rayo de theutates',
				5: 'jinete druida',
				6: 'jinete eduo',
				7: 'ariete galo',
				8: 'catapulta de guerra',
				9: 'cacique',
				10: 'colono'
			}
		},

		lang_building_types: {
			1: 'bosque',
			2: 'barrizal',
			3: 'mina de hierro',
			4: 'granja',
			5: 'serrería',
			6: 'ladrillar',
			7: 'fundición de hierro',
			8: 'molino',
			9: 'panadería',
			10: 'almacén',
			11: 'granero',
			12: '',
			13: 'herrería',
			14: 'plaza del torneos',
			15: 'edificio principal',
			16: 'plaza de reuniones',
			17: 'mercado',
			18: 'embajada',
			19: 'cuartel',
			20: 'establo',
			21: 'taller',
			22: 'academia',
			23: 'escondite',
			24: 'ayuntamiento',
			25: 'residencia',
			26: 'palacio',
			27: 'tesorería',
			28: 'oficina de comercio',
			29: 'gran cuartel',
			30: 'gran establo',
			31: 'muralla de piedra',
			32: 'muro de tierra',
			33: 'empalizada',
			34: 'cantero',
			35: 'cervecería',
			36: 'trampero',
			37: '',
			38: 'gran almacén',
			39: 'gran granero',
			40: 'maravilla',
			41: 'abrevadero',
			42: 'zanja de agua',
			43: 'muro natal',
			44: '',
			45: 'tesorería escondida'
		}
	},
	de: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_add_feature: 'neues feature',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'einfaches spähen',
		lang_navbar_inactive_finder: 'inaktiven suche',
		lang_navbar_logger: 'logs',
		lang_navbar_change_login: 'login ändern',
		lang_navbar_language: 'sprache',
		lang_navbar_search: 'features suchen',

		lang_feature_finish_earlier: 'sofortige fertigstellung',
		lang_feature_hero: 'autoabenteuer',
		lang_feature_farming: 'farmlisten schicken',
		lang_feature_queue: 'endlose bauschleife',
		lang_feature_raise_fields: 'ressourcenfelder ausbau',
		lang_feature_trade_route: 'handelsroute',
		lang_feature_timed_send: 'pünktlicher sendung',
		lang_feature_train_troops: 'truppen ausbilden',
		lang_feature_robber_hideouts: 'räuberverstecke',
		lang_feature_improve_troops: 'truppen verbessern',

		lang_feature_desc_hero: 'der held wird automatisch auf abenteuer geschickt wenn er eine gewisse mindestprozentzahl an gesundheit hat.',
		lang_feature_desc_queue: 'dies ist eine endlose bauschleife. falls du die stadt ändern willst, lege ein neues feature mit einer neuen stadt an. sonst kommt es zu problemen.',
		lang_feature_desc_raise_fields: 'die ressourcesfelder werden automatisch auf ein gewisses level ausgebaut, dabei wird geguckt welche ressource am wenigsten speicher hat.',
		lang_feature_desc_farming: 'verschickt farmlisten automatisch in einem bestimmten intervall.',
		lang_feature_desc_trade_route: 'händler werden automatisch zwischen zwei städten geschickt.',
		lang_feature_desc_timed_send: 'schickt truppen zu einer geplanten zeit, wobei die reisezeit der einheiten für die ankunftszeit berücksichtigt wird.',
		lang_feature_desc_train_troops: 'truppen in einem bestimmten intervall und in einer bestimmten reihenfolge auszubilden, geht es in jedem intervall die gesamte liste durch, wenn die menge größer ist als die kosten der verfügbaren ressourcen, bildet es so viele truppen wie möglich aus.',
		lang_feature_desc_robber_hideouts: 'sucht nach räuberverstecken und schickt die entsprechenden truppen zum angriff. er versucht es so lange mit demselben versteck, bis es zerstört ist, und geht dann zum nächsten weiter usw.',
		lang_feature_desc_improve_troops: 'prüft, ob bestimmte einheiten in einer bestimmten reihenfolge aufgerüstet werden können, zuerst wird die einheit geprüft und wenn sie nicht verfügbar ist oder das maximum erreicht hat, wird versucht, die nächste einheit aufzurüsten, die liste kann beliebig verlängert werden.',

		lang_home_name: 'feature name',
		lang_home_description: 'beschreibung',
		lang_home_status: 'status',
		lang_home_off_on: 'aus / an',
		lang_home_options: 'optionen',
		lang_home_not_configured: '<nicht eingestellt>',

		lang_easy_scout_title: 'einfaches spähen',
		lang_easy_scout_description: 'schicke 1 scout an jedes dorf in einer farmliste',

		lang_combo_box_farmlist: 'farmliste auswählen',
		lang_combo_box_village: 'dorf auswählen',
		lang_combo_box_unittype: 'einheit auswählen',
		lang_combo_box_level: 'level auswählen',
		lang_combo_box_missiontype: 'missionsart',

		lang_label_spy_for: 'spähen für',
		lang_label_ressources: 'ressource',
		lang_label_defence: 'defensiv',

		lang_table_farmlist: 'farmliste',
		lang_table_village: 'dorf',
		lang_table_remove: 'entfernen',
		lang_table_duration: 'laufzeit',
		lang_table_distance: 'distanz',
		lang_table_population: 'bevölkerung',
		lang_table_coordinates: 'koordinaten',
		lang_table_player: 'spieler',
		lang_table_kingdom: 'königreich',
		lang_table_tribe: 'stamm',
		lang_table_id: 'id',
		lang_table_name: 'name',
		lang_table_lvl: 'lvl',
		lang_table_pos: 'pos',
		lang_table_unittype: 'einheit',
		lang_table_level: 'level',
		lang_table_amount: 'menge',
		lang_table_options: 'optionen',

		lang_button_submit: 'abschicken',
		lang_button_cancel: 'abbrechen',
		lang_button_delete: 'löschen',
		lang_button_search: 'suchen',

		lang_adventure_adventure_type: 'abenteuer typ',
		lang_adventure_short: 'kurz',
		lang_adventure_long: 'lang',
		lang_adventure_min_health: 'minimum gesundheit',
		lang_adventure_max: 'max',
		lang_adventure_health: 'gesundheit',

		lang_finish_earlier_description: '5 minuten früher',

		lang_queue_res_fields: 'ressourcen felder',
		lang_queue_buildings: 'gebäude',
		lang_queue_queue: 'schleife',

		lang_farmlist_add: 'farmlist hinzufügen',
		lang_farmlist_losses: 'sortiere farmen mit verlusten zu',

		lang_robber_hideouts_registered: 'räuber registriert',
		lang_robber_hideouts_button_setrobbers: 'räuber setzen',
		lang_robber_hideouts_help_default: 'x- und y-koordinaten von jedem räuberversteck eingeben',
		lang_robber_hideouts_help_error_wrong: 'fehlermeldung: kein räuberversteck',
		lang_robber_hideouts_help_error_find: 'fehlermeldung: räuberversteck nicht gefunden!',
		lang_robber_hideouts_help_success: 'erfolgreich räuberversteck registriert!',

		lang_timed_send_arrival: 'ankunftsdatum / -zeit',
		lang_timed_send_button_settarget: 'ziel setzen',
		lang_timed_send_error_arrival_duration: 'fehlermeldung: reisedauer überschreitet ankunftszeit',
		lang_timed_send_help_error_wrong: 'etwas ist schief gelaufen, ist dein ziel ein räuber?',

		lang_finder_default: 'standard',
		lang_finder_name: 'inaktiven sucher',
		lang_finder_distance_to: 'distanz relativ zu',
		lang_finder_player_pop: 'spieler pop (min / max)',
		lang_finder_village_pop: 'dorf pop (min / max)',
		lang_finder_distance: 'distanz (min / max)',
		lang_finder_add_list: 'zur farmlist hinzufügen',
		lang_finder_inactive_for: 'inaktiv seit',
		lang_finder_days: 'tagen',
		lang_finder_description: 'sucht inaktive spieler und fügt sie mit einem klick zu einer farmliste hinzu. wenn sie einfach hinzugefügt sind kann man sie mit dem einfach spähen feature auspähen',

		lang_log_level: 'level',
		lang_log_group: 'gruppe',
		lang_log_message: 'meldung',
		lang_log_timestamp: 'zeit',

		lang_login_title: 'einloggen',
		lang_login_change_login: 'login ändern',
		lang_login_start: 'start',
		lang_login_reconnect: 'wiederverbinden mit',
		lang_login_relogin: 'oder mit einem anderen konto %',
		lang_login_relogin_button: 'anmelden',
		lang_login_info: 'wenn die app herunterfährt, hast du möglicherweise falsche anmeldedaten eingegeben, du solltes neu starten und dich wieder anmelden.',
		lang_login_notification: 'der bot beendet sich nun.... starte ihn neu damit die änderungen funktionieren',
		lang_login_reset_features: 'dies wird alle deine features zurücksetzen!',
		lang_login_gameworld: 'spielwelt',
		lang_login_email: 'email',
		lang_login_password: 'passwort',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(optional)',
		lang_login_sitter_description: 'wenn du als sitter oder dual spielst brauchen wir den ingame namen um die richtige spielwelt zu finden',
		lang_login_ingame_name: 'ingame nickname (nur als sitter oder dual benötigt)',

		lang_trade_source_village: 'ursprungsdorf wählen',
		lang_trade_dest_village: 'zieldorf wählen',
		lang_trade_send_ress: 'schicke (holz|lehm|eisen|getreide)',
		lang_trade_source_greater: 'wenn ursprung ist größer als (holz|lehm|eisen|getreide)',
		lang_trade_dest_less: 'wenn ziel ist kleiner als (holz|lehm|eisen|getreide)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'gebe eine nummer ein',
		lang_common_amount: 'menge',
		lang_common_level: 'level',
		lang_common_wood: 'holz',
		lang_common_clay: 'lehm',
		lang_common_iron: 'eisen',
		lang_common_crop: 'getreide',
		lang_common_interval: 'interval in sekunden (min / max)',
		lang_common_target: 'ziel (x / y)',
		lang_common_add_unit: 'hinzufügen',
		lang_common_add_edit: 'editieren',

		lang_mission_type_support: 'unterstützung',
		lang_mission_type_attack: 'angriff',
		lang_mission_type_raid: 'raubzug',
		lang_mission_type_spy: 'spionieren',
		lang_mission_type_siege: 'belaregung',
		lang_mission_type_settle: 'siedeln',

		lang_unit_types_hero: 'held',
		lang_unit_types: {
			1: {
				1: 'legionär',
				2: 'prätorianer',
				3: 'imperianer',
				4: 'equites legati',
				5: 'equites imperatoris',
				6: 'equites caesaris',
				7: 'rammbock',
				8: 'feuerkatapult',
				9: 'senator',
				10: 'siedler'
			},
			2: {
				1: 'keulenschwinger',
				2: 'spearkämpfer',
				3: 'axtkämpfer',
				4: 'kundschafter',
				5: 'Paladin',
				6: 'teutonen-reiter',
				7: 'rammholz',
				8: 'katapult',
				9: 'stammesführer',
				10: 'siedler'
			},
			3: {
				1: 'phalanx',
				2: 'schwertkämpfer',
				3: 'späher',
				4: 'theutates-Blitz',
				5: 'druidrenreiter',
				6: 'haeduaner',
				7: 'rammholz',
				8: 'kriegskatapult',
				9: 'häuptling',
				10: 'siedler'
			}
		},

		lang_building_types: {
			1: 'holzäller',
			2: 'lehmgrube',
			3: 'eisenmine',
			4: 'getreidefeld',
			5: 'sägewerk',
			6: 'lehmbreenerei',
			7: 'eisengießerei',
			8: 'getreidemühle',
			9: 'bäckerei',
			10: 'rohstofflager',
			11: 'kornspeicher',
			12: '',
			13: 'schmiede',
			14: 'turnierplatz',
			15: 'hauptgebäude',
			16: 'versammlungsplatz',
			17: 'marktplatz',
			18: 'botschaft',
			19: 'kaserne',
			20: 'stall',
			21: 'werkstatt',
			22: 'akademie',
			23: 'versteck',
			24: 'rathaus',
			25: 'residenz',
			26: 'palast',
			27: 'schatzkammer',
			28: 'handelskontor',
			29: 'große kaserne',
			30: 'großer stall',
			31: 'stadtmauer',
			32: 'erdwall',
			33: 'palisade',
			34: 'steinmetz',
			35: 'brauerei',
			36: 'fallensteller',
			37: '',
			38: 'großes rohstofflager',
			39: 'großer kornspeicher',
			40: 'weltwunder',
			41: 'pferdetränke',
			42: 'wassergraben',
			43: 'natarenmauer',
			44: '',
			45: 'verborgene schatzkammer'
		}
	}
};

class Language {
	availableLanguages = [];
	currentLanguage = 'en';
	store = null;

	constructor() {
		this.availableLanguages = Object.keys(languages);
	}

	translate(token) {
		if (!(token in languages[this.currentLanguage])) return token;
		return languages[this.currentLanguage][token];
	}

	changeLanguage(lang, post = true) {
		// default language
		if (!(lang in languages)) lang = 'en';
		this.currentLanguage = lang;

		if (post) axios.post('/api/language', { language: lang });

		if (!this.store) return;
		this.store.setState({ ...languages[lang] });
	}
}

const storeKeys = Object.keys(languages.en).join(',');

export {
	languages,
	storeKeys,
};

export default new Language();
