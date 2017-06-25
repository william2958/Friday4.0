import {ApplicationState} from "../../store/application-state";
import {Note} from "../../shared/models/note";
export function mapStateToSingleNoteSelector(state: ApplicationState): Note {

	return state.noteData.currentNote;

}
