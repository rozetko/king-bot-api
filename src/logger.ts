import winston from 'winston';
// @ts-ignore
import logzio_transport from 'winston-logzio';
import { format } from 'logform';
import settings from './settings';

const level = () => {
	const env = process.env.NODE_ENV || 'development';
	const isDevelopment = env === 'development';
	return isDevelopment ? 'debug' : 'warn';
};

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({ filename: settings.assets_folder + '/api.log' })
];

interface log {
	level: string
	message: string,
	group: string,
	timestamp: string
}

class logger {
	log_inst: any = null;
	logz_inst: any = null;

	log_list: log[] = [];

	constructor() {
		const LOG_FORMAT = format.combine(
			//format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
			format.colorize(),
			//format.align(),
			format.printf(
				(info) => `[${info.level}] ${info.timestamp} [[34m${info.group}[39m] ${info.message}`
			)
		);

		this.log_inst = winston.createLogger({
			level: level(),
			format: LOG_FORMAT,
			transports
		});

		this.logz_inst = winston.createLogger({
			level: 'info',
			transports: [
				new logzio_transport({
					level: 'info',
					name: 'king-bot-api',
					token: 'THlrOnExjtQlCfGYWXWSrCrFOdwgmGdh'
				})
			]
		});
	}

	info(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		const timestamp: string = this.get_timestamp();
		this.log_inst.info(this.get_logz_data(message, timestamp, group));
		this.logz_inst.info(this.get_logz_data(message, timestamp, group));
		this.log_list.push({
			level: 'info',
			message,
			group,
			timestamp
		});
	}

	warn(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		const timestamp: string = this.get_timestamp();
		this.log_inst.warn(this.get_logz_data(message, timestamp, group));
		this.logz_inst.warn(this.get_logz_data(message, timestamp, group));
		this.log_list.push({
			level: 'warn',
			message,
			group,
			timestamp
		});
	}

	error(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		const timestamp: string = this.get_timestamp();
		this.log_inst.error(this.get_logz_data(message, timestamp, group));
		this.logz_inst.error(this.get_logz_data(message, timestamp, group));
		this.log_list.push({
			level: 'error',
			message,
			group,
			timestamp
		});
	}

	debug(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		const timestamp: string = this.get_timestamp();
		this.log_inst.debug(this.get_logz_data(message, timestamp, group));
		this.logz_inst.debug(this.get_logz_data(message, timestamp, group));
	}

	get_string(obj: any): string {
		if (typeof obj === 'string') {
			return obj;
		}
		return JSON.stringify(obj);
	}

	get_logz_data(obj: any, timestamp: string, group: string): any {
		return {
			message: obj,
			timestamp,
			group,
			email: settings.email,
			gameworld: settings.gameworld,
			ip: settings.ip,
			sitter_type: settings.sitter_type,
			sitter_name: settings.sitter_name,
			program: 'king-bot-api'
		};
	}

	get_timestamp(date: Date = new Date()): string {
		let day = ('0' + date.getDate()).slice(-2);
		let month = ('0' + (date.getMonth() + 1)).slice(-2);
		let year = date.getFullYear();
		let hours = `${date.getHours()}`.padStart(2, '0');
		let minutes = `${date.getMinutes()}`.padStart(2, '0');
		let seconds = `${date.getSeconds()}`.padStart(2, '0');
		return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
	}
}

export default new logger();
