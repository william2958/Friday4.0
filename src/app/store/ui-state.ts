import {User} from "../shared/models/user";
export interface UiState {

	user: User;
	currentAccountId: string;
	currentNoteId: string;
	currentQuicknoteId: string;
	showLoginModal: boolean;
	showGuardedLoginModal: boolean;
	showSignupModal: boolean;
	errors: {[type: string]: string[]};

}

export const INITIAL_UI_STATE: UiState = {

	user: undefined,
	currentAccountId: undefined,
	currentNoteId: undefined,
	currentQuicknoteId: undefined,
	showLoginModal: false,
	showGuardedLoginModal: false,
	showSignupModal: false,
	errors: {}

};
