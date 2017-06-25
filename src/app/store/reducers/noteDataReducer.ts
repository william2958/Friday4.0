import {NoteData} from "../note-data";
import {Action} from "@ngrx/store";
import {
	NOTE_KEYS_LOADED_ACTION, NoteKeysLoadedAction, NOTES_LOADED_ACTION, NotesLoadedAction,
	SINGLE_NOTE_LOADED_ACTION, SingleNoteLoadedAction
} from "../actions/noteActions";
import * as _ from 'lodash';


export function noteData(state: NoteData, action: Action): NoteData {

	switch (action.type) {

		case NOTES_LOADED_ACTION:
			return handleNotesLoadedAction(state, action);

		case NOTE_KEYS_LOADED_ACTION:
			return handleNoteKeysLoadedAction(state, action);

		case SINGLE_NOTE_LOADED_ACTION:
			return handleSingleNoteLoadedAction(state, action);

		default:
			return state;

	}

}


function handleNotesLoadedAction(state: NoteData, action: NotesLoadedAction): NoteData {
	const newNoteData = _.cloneDeep(state);
	newNoteData.notes = [];
	for (const note of action.payload) {
		if (!(note.$value === null)) {
			// Set the key value to the $key that's returned by firebase
			note.key = note.$key;
			newNoteData.notes.push(_.cloneDeep(note));
		}
	}
	// Set the current note id to the first note included in the payload
	newNoteData.currentNoteId = action.payload[0].$key;
	return newNoteData;
}

function handleNoteKeysLoadedAction(state: NoteData, action: NoteKeysLoadedAction): NoteData {
	const newNoteData = _.cloneDeep(state);
	newNoteData.noteKeys = action.payload;
	return newNoteData;
}

function handleSingleNoteLoadedAction(state: NoteData, action: SingleNoteLoadedAction): NoteData {
	const newNoteData = _.cloneDeep(state);
	newNoteData.currentNote = action.payload;
	return newNoteData;
}
