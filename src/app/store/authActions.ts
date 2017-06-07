import {Action} from "@ngrx/store";
import {User} from "../shared/models/user";


export const SIGN_IN_EMAIL_ACTION = 'SIGN_IN_EMAIL_ACTION';
export const USER_SIGNED_IN_ACTION = 'USER_SIGNED_IN_ACTION';


export interface SignInEmailPayload {
	email: string;
	password: string;
}
export class SignInEmailAction implements Action {

	type = SIGN_IN_EMAIL_ACTION;

	constructor(public payload?: SignInEmailPayload) { }

}

export class UserSignedInAction implements Action {

	type = USER_SIGNED_IN_ACTION;

	constructor(public payload?: User) { }

}
