import {ApplicationState} from "../../../store/application-state";

export function showLoginSelector(state: ApplicationState): boolean {

	return state.uiState.showLoginModal;

}

export function showGuardedLoginSelector(state: ApplicationState): boolean {

	return state.uiState.showGuardedLoginModal;

}

export function showSignupSelector(state: ApplicationState): boolean {

	return state.uiState.showSignupModal;

}
