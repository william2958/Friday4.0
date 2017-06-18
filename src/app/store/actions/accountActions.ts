import {Action} from "@ngrx/store";
import {CreateAccountModel} from "../../shared/models/createAccount";
import {Account} from "../../shared/models/account";

export const LOAD_ACCOUNTS_ACTION = 'LOAD_ACCOUNTS_ACTION';
export const LOAD_SINGLE_ACCOUNT_ACTION = 'LOAD_SINGLE_ACCOUNT_ACTION';
export const ACCOUNTS_LOADED_ACTION = 'ACCOUNTS_LOADED_ACTION';
export const SINGLE_ACCOUNT_LOADED_ACTION = 'SINGLE_ACCOUNT_LOADED_ACTION';
export const GET_ACCOUNT_KEYS_ACTION = 'GET_ACCOUNT_KEY_ACTION';
export const ACCOUNT_KEYS_LOADED_ACTION = 'ACCOUNT_KEYS_LOADED_ACTION';
export const CREATE_ACCOUNT_ACTION = 'CREATE_ACCOUNT_ACTION';
export const UPDATE_ACCOUNT_ACTION = 'UPDATE_ACCOUNT_ACTION';
export const DELETE_ACCOUNT_ACTION = 'DELETE_ACCOUNT_ACTION';
export const LOAD_NEXT_ACCOUNTS_ACTION = 'LOAD_NEXT_ACCOUNTS_ACTION';
export const LOAD_PREV_ACCOUNTS_ACTION = 'LOAD_PREV_ACCOUNTS_ACTION';

// Tells getAccounts$ effect to go and retrieve the accounts
// Accepts the user key as payload
export class LoadAccountsAction implements Action {
	type = LOAD_ACCOUNTS_ACTION;
	constructor(public payload?: string) { }
}

export interface LoadSingleAccountPayload {
	userKey: string;
	accountKey: string;
}
export class LoadSingleAccountAction implements Action {
	type = LOAD_SINGLE_ACCOUNT_ACTION;
	constructor(public payload?: LoadSingleAccountPayload) { }
}
export class SingleAccountLoadedAction implements Action {
	type = SINGLE_ACCOUNT_LOADED_ACTION;
	constructor(public payload?: Account) { }
}

// This tells the accounts reducer that new accounts have been loaded.
// Accepts an array of accounts as the payload
export class AccountsLoadedAction implements Action {
	type = ACCOUNTS_LOADED_ACTION;
	constructor(public payload?: any) { }
}

// Gets the website names of all the accounts
export class LoadAccountKeysAction implements Action {
	type = GET_ACCOUNT_KEYS_ACTION;
	constructor(public payload?: string) { }
}

export class AccountKeysLoadedAction implements Action {
	type = ACCOUNT_KEYS_LOADED_ACTION;
	constructor(public payload?: any) { }
}

// Called when an account is to be created
// Accepts an account object and a user key as payload
export interface CreateAccountPayload {
	accountData: CreateAccountModel;
	userKey: string;
}
export class CreateAccountAction implements Action {
	type = CREATE_ACCOUNT_ACTION;
	constructor(public payload?: CreateAccountPayload) { }
}

// Called when an account is to be updated
// Accepts an account object, a user key, and an account key as payload
export interface UpdateAccountPayload {
	accountData: CreateAccountModel;
	userKey: string;
	accountKey: string;
}
export class UpdateAccountAction implements Action {
	type = UPDATE_ACCOUNT_ACTION;
	constructor(public payload?: UpdateAccountPayload) { }
}

// Called when an account is to be deleted
// Accepts the user key and account key as the payload
export interface DeleteAccountPayload {
	accountKey: string;
	userKey: string;
}
export class DeleteAccountAction implements Action {
	type = DELETE_ACCOUNT_ACTION;
	constructor(public payload?: DeleteAccountPayload) { }
}

export interface PaginateAccountsPayload {
	userKey: string;
	currentAccountKey: string;
}
export class LoadNextAccountsAction implements Action {
	type = LOAD_NEXT_ACCOUNTS_ACTION;
	constructor(public payload?: PaginateAccountsPayload) { }
}
export class LoadPrevAccountsAction implements Action {
	type = LOAD_PREV_ACCOUNTS_ACTION;
	constructor(public payload?: PaginateAccountsPayload) { }
}
