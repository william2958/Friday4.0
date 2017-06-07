import {NoteData} from "../note-data";
import {Action} from "@ngrx/store";
export function noteData(state: NoteData, action: Action): NoteData {

	switch (action.type) {

		default:
			return state;

	}

}
