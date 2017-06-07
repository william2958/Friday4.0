import { Account } from '../shared/models/account';

export interface AccountData {

	accountKeys: string[];
	accounts: Account[];

}

export const INITIAL_ACCOUNT_DATA = {

	accountKeys: [],
	accounts: []

};
