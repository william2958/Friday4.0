import {RouterState} from "@ngrx/router-store";
import {INITIAL_UI_STATE, UiState} from "./ui-state";
import {AccountData, INITIAL_ACCOUNT_DATA} from "./account-data";
import {INITIAL_NOTE_DATA, NoteData} from "./note-data";
import {INITIAL_QUICKNOTE_DATA, QuicknoteData} from "./quicknote-data";

export interface ApplicationState {

	router: RouterState;
	uiState: UiState;
	accountData: AccountData;
	noteData: NoteData;
	quicknoteData: QuicknoteData;

}

export const INITIAL_APPLICATION_STATE: ApplicationState = {

	uiState: INITIAL_UI_STATE,
	accountData: INITIAL_ACCOUNT_DATA,
	noteData: INITIAL_NOTE_DATA,
	quicknoteData: INITIAL_QUICKNOTE_DATA,
	router: {
		path: ''
	}

};
