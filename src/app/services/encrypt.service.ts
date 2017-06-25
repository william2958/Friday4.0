import {Injectable} from "@angular/core";
import * as crypto from 'crypto-js';

@Injectable()
export class EncryptService {

	constructor() { }

	encryptString(payload: string, pin: string) {
		const ciphertext = crypto.AES.encrypt(payload, pin);
		return ciphertext.toString();
	}

	decryptString(payload: string, pin: string) {
		const decryptedBytes = crypto.AES.decrypt(payload, pin);
		const plainText = decryptedBytes.toString(crypto.enc.Utf8)
		return plainText;
	}

}
