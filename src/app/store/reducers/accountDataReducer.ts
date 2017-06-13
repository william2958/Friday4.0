import {AccountData} from "../account-data";
import {Action} from "@ngrx/store";
import {ACCOUNTS_LOADED_ACTION, AccountsLoadedAction} from "../actions/accountActions";

import * as _ from 'lodash';

export function accountData(state: AccountData, action: Action): AccountData {

	switch (action.type) {

		case ACCOUNTS_LOADED_ACTION:
			return handleAccountsLoadedAction(state, action);

		default:
			return state;

	}

}

function handleAccountsLoadedAction(state: AccountData, action: AccountsLoadedAction): AccountData {
	const newAccountData = _.cloneDeep(state);
	newAccountData.accounts = action.payload;
	return newAccountData;
}
