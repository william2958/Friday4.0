import {ApplicationState} from "../../store/application-state";
import {Note} from "../../shared/models/note";

export function mapStateToNoteKeysSelector(state: ApplicationState): string[] {

	return state.noteData.noteKeys;

}

export function mapStateToNotesSelector(state: ApplicationState): Note[] {

	return state.noteData.notes;

}

export function mapStateToCurrentNoteKeySelector(state: ApplicationState): string {

	return state.noteData.currentNoteId;

}
