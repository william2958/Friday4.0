import {Action} from "@ngrx/store";

export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const QUICKNOTE_ERROR = 'QUICKNOTE_ERROR';
export const ACCOUNT_ERROR = 'ACCOUNT_ERROR';

export const SUCCESS_TOAST = 'SUCCESS_TOAST';
export const WARNING_TOAST = 'WARNING_TOAST';
export const ERROR_TOAST = 'ERROR_TOAST';

export const ERROR_OCCURRED_ACTION = 'ERROR_OCCURRED_ACTION';
export const CLEAR_ERROR_ACTION = 'CLEAR_ERROR_ACTION';
export const SHOW_TOAST_ACTION = 'SHOW_TOAST_ACTION';

export interface ErrorPayload {
	type: string;
	message: string;
}
export class ErrorOccurredAction implements Action {

	type = ERROR_OCCURRED_ACTION;

	constructor(public payload?: ErrorPayload) { }

}

export class ClearErrorAction implements Action {

	type = CLEAR_ERROR_ACTION;

	constructor(public payload?: string) { }

}

export class ShowToastAction implements Action {

	type = SHOW_TOAST_ACTION;

	constructor(public payload?: string[]) { }

}
