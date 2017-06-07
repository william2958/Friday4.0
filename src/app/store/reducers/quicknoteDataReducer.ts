import {QuicknoteData} from "../quicknote-data";
import {Action} from "@ngrx/store";
export function quicknoteData(state: QuicknoteData, action: Action): QuicknoteData {

	switch (action.type) {

		default:
			return state;

	}

}
