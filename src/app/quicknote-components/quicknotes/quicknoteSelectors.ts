import {ApplicationState} from "../../store/application-state";
import {Quicknote} from "../../shared/models/quicknote";

export function mapStateToQuicknotesSelector(state: ApplicationState): Quicknote[] {

	return state.quicknoteData.quicknotes;

}
