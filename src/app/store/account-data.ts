import { Account } from '../shared/models/account';

export interface AccountData {

	accountKeys: any[];
	accounts: Account[];
	currentAccountId: string;
	currentAccount: Account;

}

export const INITIAL_ACCOUNT_DATA = {

	accountKeys: [],
	accounts: [],
	currentAccountId: undefined,
	currentAccount: undefined

};
