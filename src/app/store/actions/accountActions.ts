import {Action} from "@ngrx/store";
import {Account} from "../../shared/models/account";

export const LOAD_ACCOUNTS_ACTION = 'LOAD_ACCOUNTS_ACTION';
export const ACCOUNTS_LOADED_ACTION = 'ACCOUNTS_LOADED_ACTION';

export class LoadAccountsAction implements Action {
	type = LOAD_ACCOUNTS_ACTION;
	// User uid as payload
	constructor(public payload?: string) { }
}

export class AccountsLoadedAction implements Action {
	type = ACCOUNTS_LOADED_ACTION;
	constructor(public payload?: any) { }
}
