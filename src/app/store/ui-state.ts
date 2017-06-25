import {User} from "../shared/models/user";
export interface UiState {

	user: User;
	currentNoteId: string;
	currentQuicknoteId: string;
	showLoginModal: boolean;
	showSignupModal: boolean;
	showPinModal: boolean;
	errors: {[type: string]: string[]};
	pin: string;
	pin_set: boolean;

}

export const INITIAL_UI_STATE: UiState = {

	user: undefined,
	currentNoteId: undefined,
	currentQuicknoteId: undefined,
	showLoginModal: false,
	showSignupModal: false,
	showPinModal: false,
	errors: {},
	pin: undefined,
	pin_set: false

};
