import {ApplicationState} from "../application-state";

export function pinSelector(state: ApplicationState): string {

	return state.uiState.pin;

}

export function pinSetSelector(state: ApplicationState): boolean {

	return state.uiState.pin_set;

}
