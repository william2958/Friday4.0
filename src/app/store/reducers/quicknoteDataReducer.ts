import {QuicknoteData} from "../quicknote-data";
import {Action} from "@ngrx/store";
import {CREATE_QUICKNOTE_ACTION, CreateQuicknoteAction} from "../actions/quicknoteActions";
export function quicknoteData(state: QuicknoteData, action: Action): QuicknoteData {

	switch (action.type) {

		default:
			return state;

	}

}
