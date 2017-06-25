import {QuicknoteData} from "../quicknote-data";
import {Action} from "@ngrx/store";
import {QUICKNOTES_LOADED_ACTION, QuicknotesLoadedAction} from "../actions/quicknoteActions";
import * as _ from 'lodash';

export function quicknoteData(state: QuicknoteData, action: Action): QuicknoteData {

	switch (action.type) {

		case QUICKNOTES_LOADED_ACTION:
			return handleQuicknotesLoadedAction(state, action);

		default:
			return state;

	}

}

function handleQuicknotesLoadedAction(state: QuicknoteData, action: QuicknotesLoadedAction): QuicknoteData {
	const newQuicknoteData = _.cloneDeep(state);
	newQuicknoteData.quicknotes = [];
	for (const quicknote of action.payload) {
		if (!(quicknote.$value === null)) {
			quicknote.key = quicknote.$key;
			newQuicknoteData.quicknotes.push(_.cloneDeep(quicknote));
		}
	}
	return newQuicknoteData;
}
