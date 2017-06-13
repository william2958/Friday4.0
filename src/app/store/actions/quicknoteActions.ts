import {Action} from "@ngrx/store";

export const CREATE_QUICKNOTE_ACTION = 'CREATE_QUICKNOTE_ACTION';

export interface QuicknotePayload {
	email: string;
	note: string;
}
export class CreateQuicknoteAction implements Action {
	type = CREATE_QUICKNOTE_ACTION;
	constructor(public payload?: QuicknotePayload) { }
}
