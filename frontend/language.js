import axios from 'axios';

const languages = {
	en: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_home: 'home',
		lang_navbar_add_feature: 'add feature',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'easy scout',
		lang_navbar_inactive_finder: 'inactive finder',
		lang_navbar_logger: 'logger',
		lang_navbar_change_login: 'change login',
		lang_navbar_language: 'language',

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

		lang_feature_desc_hero: 'this feature sends the hero automaticly on an adventure if the health is above given percentage.',
		lang_feature_desc_queue: 'this is an endless building queue. don\'t change the village once it\'s set, if you want to change the village, just do another building queue feature with your desired village.',
		lang_feature_desc_raise_fields: 'this feature will raise all your fields to a given level on it\'s own, it will always upgrade the type which got the lowest storage.',
		lang_feature_desc_farming: 'this feature will just send the farmlist in a given interval.',
		lang_feature_desc_trade_route: 'sends merchants from the origin village to the desination at a given interval.',
		lang_feature_desc_train_troops: 'train troops in a given interval, if the amount is 0, it will train as many troops as possible.',
		lang_feature_desc_robber_hideouts: 'check for robber hideouts and send the given units to attack them, it will retry with the same hideout until its destroyed, and then it will move on to the next and so on.',
		lang_feature_desc_improve_troops: 'checks if it can upgrade given units in given order, first it checks unit and if it is not available or is maxed out, it will try to upgrade the next unit, you can increase the list as long as you want to.',

		lang_home_features: 'your features',
		lang_home_name: 'feature name',
		lang_home_description: 'description',
		lang_home_status: 'status',
		lang_home_off_on: 'off / on',
		lang_home_options: 'options',

		lang_easy_scout_title: 'easy scout',
		lang_easy_scout_description: 'send 1 scout to every farm in the given farmlist',
		lang_easy_scout_amount: 'amount',

		lang_combo_box_select_farmlist: 'select farmlist',
		lang_combo_box_select_village: 'select village',

		lang_label_spy_for: 'spy for',
		lang_label_ressources: 'resources',
		lang_label_defence: 'defence',

		lang_table_farmlist: 'farmlist',
		lang_table_village: 'village',
		lang_table_remove: 'remove',

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

		lang_queue_res_fields: 'resource fields',
		lang_queue_buildings: 'buildings',
		lang_queue_queue: 'queue',
		lang_queue_level: 'level',
		lang_queue_wood: 'wood',
		lang_queue_clay: 'clay',
		lang_queue_iron: 'iron',
		lang_queue_crop: 'crop',

		lang_farmlist_add: 'add farmlist',
		lang_farmlist_interval: 'interval in seconds (min / max)',
		lang_farmlist_losses: 'move farms with losses to',

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

		lang_login_notification: 'the bot is going to shut down.... restart it, so the changes take effect.',
		lang_login_reset_features: 'this will reset all features you configured!',
		lang_login_login: 'login',
		lang_login_gameworld: 'gameworld',
		lang_login_email: 'email',
		lang_login_password: 'password',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(optional)',
		lang_login_sitter_description: 'if you play as a sitter or dual we need the ingame name to identify the correct gameworld id',
		lang_login_ingame_name: 'ingame name (only when sitter or dual)',

		lang_trade_source_village: 'select source village',
		lang_trade_dest_village: 'select destination village',
		lang_trade_interval: 'interval in seconds (min / max)',
		lang_trade_send_ress: 'send (wood|clay|iron|crop)',
		lang_trade_source_greater: 'when source is greater than (wood|clay|iron|crop)',
		lang_trade_dest_less: 'and destination is less than (wood|clay|iron|crop)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'provide a number',
	},
	es: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_home: 'home',
		lang_navbar_add_feature: 'añadir característica',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'explorador sencillo',
		lang_navbar_inactive_finder: 'buscador de inactivos',
		lang_navbar_logger: 'logger',
		lang_navbar_change_login: 'cambiar login',
		lang_navbar_language: 'idioma',

		lang_feature_finish_earlier: 'completado instantáneo',
		lang_feature_hero: 'auto aventura',
		lang_feature_farming: 'enviar lista de vacas',
		lang_feature_queue: 'cola de construcción',
		lang_feature_raise_fields: 'subir campos',
		lang_feature_trade_route: 'ruta comercial',
		lang_feature_timed_send: 'envío temporizado',
		lang_feature_train_troops: 'entrenar tropas',
		lang_feature_robber_hideouts: 'escondites de ladrones',
		lang_feature_improve_troops: 'mejorar tropas',

		lang_feature_desc_hero: 'esta característica envía al héroe automáticamente a una aventura si la salud está por encima del porcentaje dado.',
		lang_feature_desc_queue: 'esta es una cola de construcción interminable, no cambies la aldea una vez que esté establecida, si quieres cambiar la aldea, simplemente crea otra característica de cola de construcción con tu aldea deseada.',
		lang_feature_desc_raise_fields: 'esta característica subirá todos tus campos a un nivel determinado automáticamente, siempre actualizará el tipo que tenga el almacenamiento más bajo.',
		lang_feature_desc_farming: 'esta característica se limitará a enviar la lista de vacas en un intervalo determinado.',
		lang_feature_desc_trade_route: 'envía a los comerciantes de la aldea de origen a la de destino en un intervalo determinado.',
		lang_feature_desc_train_troops: 'entrenar tropas en un intervalo determinado, si la cantidad es 0, entrenará todas las tropas posibles.',
		lang_feature_desc_robber_hideouts: 'comprueba los escondites de los ladrones y envía las unidades dadas para atacarlos, volverá a intentar con el mismo escondite hasta que sea destruido, y entonces pasará al siguiente y así sucesivamente.',
		lang_feature_desc_improve_troops: 'comprueba si puede mejorar las unidades dadas en un orden determinado, primero comprueba la unidad y si no está disponible o está al máximo, intentará mejorar la siguiente unidad, puedes aumentar la lista tanto como quieras.',

		lang_home_features: 'tus características',
		lang_home_name: 'característica',
		lang_home_description: 'descripción',
		lang_home_status: 'estado',
		lang_home_off_on: 'off / on',
		lang_home_options: 'opciones',

		lang_easy_scout_title: 'explorador sencillo',
		lang_easy_scout_description: 'enviar 1 explorador a cada vaca de la lista de vacas dada.',
		lang_easy_scout_amount: 'cantidad',

		lang_combo_box_select_farmlist: 'seleccionar lista de vacas',
		lang_combo_box_select_village: 'seleccionar aldea',

		lang_label_spy_for: 'espiar para',
		lang_label_ressources: 'recursos',
		lang_label_defence: 'defensa',

		lang_table_farmlist: 'lista de vacas',
		lang_table_village: 'aldea',
		lang_table_remove: 'eliminar',

		lang_table_distance: 'distancia',
		lang_table_population: 'población',
		lang_table_coordinates: 'coordenadas',
		lang_table_player: 'jugador',
		lang_table_kingdom: 'reino',
		lang_table_tribe: 'tribu',
		lang_table_id: 'id',
		lang_table_name: 'nombre',
		lang_table_lvl: 'nvl',
		lang_table_pos: 'pos',

		lang_table_unittype: 'unidad',
		lang_table_level: 'nivel',
		lang_table_options: 'opciones',

		lang_button_submit: 'enviar',
		lang_button_cancel: 'cancelar',
		lang_button_delete: 'eliminar',
		lang_button_search: 'buscar',

		lang_adventure_adventure_type: 'tipo de aventura',
		lang_adventure_short: 'corta',
		lang_adventure_long: 'larga',
		lang_adventure_min_health: 'salud mínima',
		lang_adventure_max: 'máx.',
		lang_adventure_health: 'salud',

		lang_queue_res_fields: 'campos de recursos',
		lang_queue_buildings: 'edificios',
		lang_queue_queue: 'cola',
		lang_queue_level: 'nivel',
		lang_queue_wood: 'madera',
		lang_queue_clay: 'barro',
		lang_queue_iron: 'hierro',
		lang_queue_crop: 'cereal',

		lang_farmlist_add: 'añadir lista de vacas',
		lang_farmlist_interval: 'intervalo en segundos (mín. / máx.)',
		lang_farmlist_losses: 'mover vacas con pérdidas a',

		lang_finder_default: 'por defecto',
		lang_finder_name: 'buscador de inactivos',
		lang_finder_distance_to: 'distancia relativa a',
		lang_finder_player_pop: 'población jugador (mín. / máx.)',
		lang_finder_village_pop: 'población aldea (mín. / máx.)',
		lang_finder_distance: 'distancia (mín. / máx.)',
		lang_finder_add_list: 'añadir a lista de vacas',
		lang_finder_inactive_for: 'inactivo durante',
		lang_finder_days: 'días',
		lang_finder_description: 'busca a los jugadores inactivos y muestra sus aldeas en función de la distancia, una vez que los hayas añadido a tu lista de vacas, puedes utilizar la función de exploración sencillo para espiarlos.',

		lang_log_level: 'nivel',
		lang_log_group: 'grupo',
		lang_log_message: 'mensaje',
		lang_log_timestamp: 'tiempo',

		lang_login_notification: 'el bot se va a apagar.... reinícialo, para que los cambios surtan efecto.',
		lang_login_reset_features: '¡esto restablecerá todas las características que hayas configurado!',
		lang_login_login: 'login',
		lang_login_gameworld: 'mundo de juego',
		lang_login_email: 'correo electrónico',
		lang_login_password: 'contraseña',
		lang_login_sitter_dual: 'representante / dual ?',
		lang_login_optional: '(opcional)',
		lang_login_sitter_description: 'si juegas como representante o dual necesitamos el nombre en el juego para identificar el id correcto del mundo de juego',
		lang_login_ingame_name: 'nombre en el juego (sólo cuando se trata de un representante o de un dual)',

		lang_trade_source_village: 'seleccionar aldea de origen',
		lang_trade_dest_village: 'seleccionar aldea de destino',
		lang_trade_interval: 'intervalo en segundos (mín. / máx.)',
		lang_trade_send_ress: 'enviar (madera|barro|hierro|cereal)',
		lang_trade_source_greater: 'cuando el origen es mayor que (madera|barro|hierro|cereal)',
		lang_trade_dest_less: 'y el destino es inferior a (madera|barro|hierro|cereal)',

		lang_common_min: 'mín.',
		lang_common_max: 'máx.',
		lang_common_prov_number: 'proporciona un número',
	},
	de: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_home: 'startseite',
		lang_navbar_add_feature: 'neues feature',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'einfaches spähen',
		lang_navbar_inactive_finder: 'inaktiven suche',
		lang_navbar_logger: 'logger',
		lang_navbar_change_login: 'login ändern',
		lang_navbar_language: 'sprache',

		lang_feature_finish_earlier: 'schneller bauen',
		lang_feature_hero: 'automatisches abenteuer',
		lang_feature_farming: 'farmlisten schicken',
		lang_feature_queue: 'endlose bauschleife',
		lang_feature_raise_fields: 'ressourcenfelder ausbau',
		lang_feature_trade_route: 'handelsroute',
		lang_feature_timed_send: 'pünktlicher angriff',
		lang_feature_train_troops: 'truppen trainieren',
		lang_feature_robber_hideouts: 'räuberverstecke',

		lang_feature_desc_hero: 'der held wird automatisch auf abenteuer geschickt wenn er eine gewisse mindestprozentzahl an gesundheit hat.',
		lang_feature_desc_queue: 'dies ist eine endlose bauschleife. falls du die stadt ändern willst, lege ein neues feature mit einer neuen stadt an. sonst kommt es zu problemen.',
		lang_feature_desc_raise_fields: 'die ressourcesfelder werden automatisch auf ein gewisses level ausgebaut. dabei wird geguckt welche ressource am wenigsten speicher hat.',
		lang_feature_desc_farming: 'dieses feature verschickt farmlisten automatisch in einem bestimmten intervall.',
		lang_feature_desc_trade_route: 'händler werden automatisch zwischen zwei städten geschickt.',
		lang_feature_desc_train_troops: 'truppen in einem bestimmten intervall trainieren, wenn die menge 0 ist, werden so viele truppen wie möglich trainiert.',
		lang_feature_desc_robber_hideouts: 'sucht nach räuberverstecken und schickt die entsprechenden truppen zum angriff. er versucht es so lange mit demselben versteck, bis es zerstört ist, und geht dann zum nächsten weiter usw.',

		lang_home_features: 'deine features',
		lang_home_name: 'feature name',
		lang_home_description: 'beschreibung',
		lang_home_status: 'status',
		lang_home_off_on: 'aus / an',
		lang_home_options: 'optionen',

		lang_easy_scout_title: 'einfaches spähen',
		lang_easy_scout_description: 'schicke 1 scout an jedes dorf in einer farmliste',
		lang_easy_scout_amount: 'menge',

		lang_combo_box_select_farmlist: 'farmliste auswählen',
		lang_combo_box_select_village: 'dorf auswählen',

		lang_label_spy_for: 'spähen für',
		lang_label_ressources: 'ressource',
		lang_label_defence: 'defensiv',

		lang_table_farmlist: 'farmliste',
		lang_table_village: 'dorf',
		lang_table_remove: 'entfernen',

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

		lang_table_unittype: 'einheitstyp',
		lang_table_level: 'level',

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

		lang_queue_res_fields: 'ressourcen felder',
		lang_queue_buildings: 'gebäude',
		lang_queue_queue: 'schleife',
		lang_queue_level: 'level',
		lang_queue_wood: 'holz',
		lang_queue_clay: 'lehm',
		lang_queue_iron: 'eisen',
		lang_queue_crop: 'getreide',

		lang_farmlist_add: 'farmlist hinzufügen',
		lang_farmlist_interval: 'interval in sekunden (min / max)',
		lang_farmlist_losses: 'sortiere farmen mit verlusten zu',

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

		lang_login_notification: 'der bot beendet sich nun.... starte ihn neu damit die änderungen funktionieren',
		lang_login_reset_features: 'dies wird alle deine features zurücksetzen!',
		lang_login_login: 'einloggen',
		lang_login_gameworld: 'spielwelt',
		lang_login_email: 'email',
		lang_login_password: 'passwort',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(optional)',
		lang_login_sitter_description: 'wenn du als sitter oder dual spielst brauchen wir den ingame namen um die richtige spielwelt zu finden',
		lang_login_ingame_name: 'ingame nickname (nur als sitter oder dual benötigt)',

		lang_trade_source_village: 'ursprungsdorf wählen',
		lang_trade_dest_village: 'zieldorf wählen',
		lang_trade_interval: 'interval in sekunden (min / max)',
		lang_trade_send_ress: 'schicke (holz|lehm|eisen|getreide)',
		lang_trade_source_greater: 'wenn ursprung ist größer als (holz|lehm|eisen|getreide)',
		lang_trade_dest_less: 'wenn ziel ist kleiner als (holz|lehm|eisen|getreide)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'gebe eine nummer ein',
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
