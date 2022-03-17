import fs from 'fs';
import path from 'path';
// @ts-ignore
import ip from 'public-ip';

const BASE_DIR: string = path.join(__dirname, '../');

class settings {
	assets_folder: string = BASE_DIR + './assets';
	database_name: string = '/database.json';
	buildings_name: string = '/buildings.json';
	credentials_name: string = '/cred.txt';

	gameworld: string;
	email: string;
	sitter_type: string;
	sitter_name: string;
	avatar_name: string;
	ip: string;

	async init(): Promise<void> {
		try {
			this.ip = await ip.v4();
		} catch {
			this.ip = '0.0.0.0';
		}
	}

	read_credentials(): Icredentials {
		const filename: string = this.assets_folder + this.credentials_name;

		if (!fs.existsSync(filename)) return null;

		let cred: string = fs.readFileSync(filename, 'utf-8');
		let cred_array: string[] = cred.trim().split(';');
		let sitter_type: string = '';
		let sitter_name: string = '';

		if (cred_array.length >= 5) {
			sitter_type = cred_array[3];
			sitter_name = cred_array[4];
		}

		return {
			email: cred_array[0],
			password: cred_array[1],
			gameworld: cred_array[2],
			sitter_name,
			sitter_type
		};
	}

	write_credentials(gameworld: string, email: string, password: string, sitter_type: string, sitter_name: string): void {
		// change credentials
		const filename: string = this.assets_folder + this.credentials_name;

		let credString: string = `${email};${password};${gameworld}`;
		if (sitter_type && sitter_name)
			credString += `;${sitter_type};${sitter_name}`;

		fs.writeFileSync(filename, credString);

		// delete database
		const databasePath: string = this.assets_folder + this.database_name;
		fs.unlinkSync(databasePath);
	}
}

interface Icredentials {
	email: string
	password: string
	gameworld: string
	sitter_name: string
	sitter_type: string
}

export default new settings();
