import {ApplicationState} from "../application-state";
export function userKeySelector(state: ApplicationState): string {

	if (state.uiState.user) {
		return state.uiState.user.uid;
	} else {
		return '';
	}

}
