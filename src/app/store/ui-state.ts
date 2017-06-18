import {User} from "../shared/models/user";
export interface UiState {

	user: User;
	currentNoteId: string;
	currentQuicknoteId: string;
	showLoginModal: boolean;
	showGuardedLoginModal: boolean;
	showSignupModal: boolean;
	errors: {[type: string]: string[]};

}

export const INITIAL_UI_STATE: UiState = {

	user: undefined,
	currentNoteId: undefined,
	currentQuicknoteId: undefined,
	showLoginModal: false,
	showGuardedLoginModal: false,
	showSignupModal: false,
	errors: {}

};
