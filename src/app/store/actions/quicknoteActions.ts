import {Action} from "@ngrx/store";

export const LOAD_QUICKNOTES_ACTION = 'LOAD_QUICKNOTES_ACTION';
export const QUICKNOTES_LOADED_ACTION = 'QUICKNOTES_LOADED_ACTION';
export const CREATE_QUICKNOTE_ACTION = 'CREATE_QUICKNOTE_ACTION';
export const DELETE_QUICKNOTE_ACTION = 'DELETE_QUICKNOTE_ACTION';
export const DELETE_ALL_QUICKNOTES_ACTION = 'DELETE_ALL_QUICKNOTES_ACTION';

export class LoadQuicknotesAction implements Action {
	type = LOAD_QUICKNOTES_ACTION;
	// Payload is user key
	constructor(public payload?: string) { }
}

export class QuicknotesLoadedAction implements Action {
	type = QUICKNOTES_LOADED_ACTION;
	// Payload is array of quicknotes
	constructor(public payload?: any) { }
}

export interface QuicknotePayload {
	email: string;
	body: string;
}
export class CreateQuicknoteAction implements Action {
	type = CREATE_QUICKNOTE_ACTION;
	constructor(public payload?: QuicknotePayload) { }
}

export class DeleteQuicknoteAction implements Action {
	type = DELETE_QUICKNOTE_ACTION;
	constructor(public payload?: {userKey: string, quicknoteKey: string}) { }
}

export class DeleteAllQuicknotesAction implements Action {
	type = DELETE_ALL_QUICKNOTES_ACTION;
	// Payload is user key
	constructor(public payload?: string) { }
}
