import {AccountData} from "../account-data";
import {Action} from "@ngrx/store";
import {
	ACCOUNT_KEYS_LOADED_ACTION, AccountKeysLoadedAction, ACCOUNTS_LOADED_ACTION,
	AccountsLoadedAction, SINGLE_ACCOUNT_LOADED_ACTION, SingleAccountLoadedAction
} from "../actions/accountActions";

import * as _ from 'lodash';

export function accountData(state: AccountData, action: Action): AccountData {

	switch (action.type) {

		case ACCOUNTS_LOADED_ACTION:
			return handleAccountsLoadedAction(state, action);

		case ACCOUNT_KEYS_LOADED_ACTION:
			return handleAccountKeysLoadedAction(state, action);

		case SINGLE_ACCOUNT_LOADED_ACTION:
			return handleSingleAccountLoadedAction(state, action);

		default:
			return state;

	}

}

function handleAccountsLoadedAction(state: AccountData, action: AccountsLoadedAction): AccountData {
	const newAccountData = _.cloneDeep(state);
	newAccountData.accounts = [];
	for (const account of action.payload) {
		if (!(account.$value === null)) {
			// Set the key value to the $key that's returned by firebase
			account.key = account.$key;
			newAccountData.accounts.push(account);
		}
	}
	// Set the current account id to the first account included in the payload
	newAccountData.currentAccountId = action.payload[0].$key;
	return newAccountData;
}

function handleAccountKeysLoadedAction(state: AccountData, action: AccountKeysLoadedAction): AccountData {
	const newAccountData = _.cloneDeep(state);
	newAccountData.accountKeys = action.payload;
	return newAccountData;
}

function handleSingleAccountLoadedAction(state: AccountData, action: SingleAccountLoadedAction): AccountData {
	const newAccountData = _.cloneDeep(state);
	newAccountData.currentAccount = action.payload;
	return newAccountData;
}
