import {Action} from "@ngrx/store";
import {User} from "../../shared/models/user";

export const UPDATE_USER_ACTION = 'UPDATE_USER_ACTION';
export const GET_FIREBASE_USER_ACTION = 'GET_FIREBASE_USER_ACTION';
export const SIGN_IN_EMAIL_ACTION = 'SIGN_IN_EMAIL_ACTION';
export const SIGN_IN_GOOGLE_ACTION = 'SIGN_IN_GOOGLE_ACTION';
export const GET_FIREBASE_GOOGLE_USER_ACTION = 'GET_FIREBASE_GOOGLE_USER_ACTION';
export const USER_SIGNED_IN_ACTION = 'USER_SIGNED_IN_ACTION';
export const SIGNUP_ACTION = 'SIGNUP_ACTION';
export const SIGN_OUT_ACTION = 'SIGN_OUT_ACTION';
export const SIGNED_OUT_ACTION = 'SIGNED_OUT_ACTION';
export const SHOW_LOGIN_MODAL_ACTION = 'SHOW_LOGIN_MODAL_ACTION';
export const SHOW_SIGNUP_MODAL_ACTION = 'SHOW_SIGNUP_MODAL_ACTION';

export class UpdateUserAction implements Action {
	type = UPDATE_USER_ACTION;
	constructor(public payload?: User) { }
}

export class GetFirebaseUserAction implements Action {
	type = GET_FIREBASE_USER_ACTION;
	// Uid string
	constructor(public payload?: string) { }
}

export class GetFirebaseGoogleUserAction implements Action {
	type = GET_FIREBASE_GOOGLE_USER_ACTION;
	// Uid string
	constructor(public payload?: string) { }
}

export interface SignInEmailPayload {
	email: string;
	password: string;
}
export class SignInEmailAction implements Action {
	type = SIGN_IN_EMAIL_ACTION;
	constructor(public payload?: SignInEmailPayload) { }
}

export class SignInGoogleAction implements Action {
	type = SIGN_IN_GOOGLE_ACTION;
}

export class UserSignedInAction implements Action {
	type = USER_SIGNED_IN_ACTION;
	constructor(public payload?: User) { }
}

export interface SignupPayload {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
}
export class SignupAction implements Action {
	type = SIGNUP_ACTION;
	constructor(public payload?: SignupPayload) { }
}

export class SignOutAction implements Action {
	type = SIGN_OUT_ACTION;
}

export class SignedOutAction implements Action {
	type = SIGNED_OUT_ACTION;
}

export class ShowLoginModalAction implements Action {
	type = SHOW_LOGIN_MODAL_ACTION;
}

export class ShowSignupModalAction implements Action {
	type = SHOW_SIGNUP_MODAL_ACTION;
}
