import {Note} from "../shared/models/note";
export interface NoteData {

	noteKeys: string[];
	notes: Note[];
	currentNoteId: string;
	currentNote: Note;

}

export const INITIAL_NOTE_DATA = {

	noteKeys: [],
	notes: [],
	currentNoteId: undefined,
	currentNote: undefined

};
