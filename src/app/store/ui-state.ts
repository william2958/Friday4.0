import {User} from "../shared/models/user";
export interface UiState {

	user: User;
	currentAccountId: string;
	currentNoteId: string;
	currentQuicknoteId: string;

}

export const INITIAL_UI_STATE: UiState = {

	user: undefined,
	currentAccountId: undefined,
	currentNoteId: undefined,
	currentQuicknoteId: undefined

};
