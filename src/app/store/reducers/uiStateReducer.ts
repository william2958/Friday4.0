import {INITIAL_UI_STATE, UiState} from "../ui-state";
import {Action} from "@ngrx/store";
import {
	SHOW_GUARDED_MODAL_ACTION,
	SHOW_LOGIN_MODAL_ACTION, SHOW_SIGNUP_MODAL_ACTION, ShowGuardedModalAction, ShowLoginModalAction,
	ShowSignupModalAction, SIGNED_OUT_ACTION, UPDATE_USER_ACTION,
	USER_SIGNED_IN_ACTION,
	UserSignedInAction
} from "../actions/authActions";
import * as _ from 'lodash';
import {CLEAR_ERROR_ACTION, ClearErrorAction, ERROR_OCCURRED_ACTION, ErrorOccurredAction} from "../actions/globalActions";

export function uiState(state: UiState = INITIAL_UI_STATE, action: Action): UiState {

	switch (action.type) {

		case UPDATE_USER_ACTION:
			return handleUserSignedInAction(state, action);

		case USER_SIGNED_IN_ACTION:
			return handleUserSignedInAction(state, action);

		case SIGNED_OUT_ACTION:
			return handleSignedOutAction(state, action);

		case SHOW_LOGIN_MODAL_ACTION:
			return handleShowLoginModalAction(state, action);

		case SHOW_GUARDED_MODAL_ACTION:
			return handleShowGuardedLoginModalAction(state, action);

		case SHOW_SIGNUP_MODAL_ACTION:
			return handleShowSignupModalAction(state, action);

		case ERROR_OCCURRED_ACTION:
			return handleErrorOccuredAction(state, action);

		case CLEAR_ERROR_ACTION:
			return handleClearErrorAction(state, action);

		default:
			return state;

	}

}

function handleUserSignedInAction(state: UiState, action: UserSignedInAction): UiState {
	const newUiState = _.cloneDeep(state);
	newUiState.user = action.payload;
	return newUiState;
}

function handleSignedOutAction(state: UiState, action: UserSignedInAction): UiState {

	const newUiState: UiState = _.cloneDeep(state);

	newUiState.user = undefined;
	newUiState.currentAccountId = undefined;
	newUiState.currentNoteId = undefined;
	newUiState.currentQuicknoteId = undefined;

	return newUiState;

}

function handleShowLoginModalAction(state: UiState, action: ShowLoginModalAction): UiState {
	const newUiState: UiState = _.cloneDeep(state);
	newUiState.showLoginModal = !newUiState.showLoginModal;
	return newUiState;
}

function handleShowGuardedLoginModalAction(state: UiState, action: ShowGuardedModalAction): UiState {
	const newUiState: UiState = _.cloneDeep(state);
	newUiState.showGuardedLoginModal = !newUiState.showGuardedLoginModal;
	return newUiState;
}

function handleShowSignupModalAction(state: UiState, action: ShowSignupModalAction): UiState {
	const newUiState: UiState = _.cloneDeep(state);
	newUiState.showSignupModal = !newUiState.showSignupModal;
	return newUiState;
}

function handleErrorOccuredAction(state: UiState, action: ErrorOccurredAction): UiState {
	const newUiState: UiState = _.cloneDeep(state);
	if (!newUiState.errors[action.payload.type]) {
		newUiState.errors[action.payload.type] = [];
	}
	newUiState.errors[action.payload.type].push(action.payload.message);
	console.log('updated errors array: ', newUiState.errors);
	return newUiState;
}

function handleClearErrorAction(state: UiState, action: ClearErrorAction): UiState {
	const newUiState: UiState = _.cloneDeep(state);
	newUiState.errors[action.payload] = [];
	return newUiState;
}
