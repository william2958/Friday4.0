import {Action} from "@ngrx/store";
import {CreateAccountModel} from "../../shared/models/createAccount";

export const LOAD_ACCOUNTS_ACTION = 'LOAD_ACCOUNTS_ACTION';
export const ACCOUNTS_LOADED_ACTION = 'ACCOUNTS_LOADED_ACTION';
export const CREATE_ACCOUNT_ACTION = 'CREATE_ACCOUNT_ACTION';
export const ACCOUNT_CREATED_ACTION = 'ACCOUNT_CREATED_ACTION';

export class LoadAccountsAction implements Action {
	type = LOAD_ACCOUNTS_ACTION;
	// User uid as payload
	constructor(public payload?: string) { }
}

export class AccountsLoadedAction implements Action {
	type = ACCOUNTS_LOADED_ACTION;
	constructor(public payload?: any) { }
}

export interface CreateAccountPayload {
	accountData: CreateAccountModel;
	userKey: string;
}
export class CreateAccountAction implements Action {
	type = CREATE_ACCOUNT_ACTION;
	constructor(public payload?: CreateAccountPayload) { }
}

export class AccountCreatedAction implements Action {
	type = ACCOUNT_CREATED_ACTION;
}
