import {INITIAL_UI_STATE, UiState} from "../ui-state";
import {Action} from "@ngrx/store";
import {USER_SIGNED_IN_ACTION, UserSignedInAction} from "../authActions";
import * as _ from 'lodash';

export function uiState(state: UiState = INITIAL_UI_STATE, action: Action): UiState {

	switch (action.type) {

		case USER_SIGNED_IN_ACTION:
			return handleUserSignedInAction(state, action);

		default:
			return state;

	}

}

function handleUserSignedInAction(state: UiState, action: UserSignedInAction) {

	const newUiState = _.cloneDeep(state);

	newUiState.user = action.payload;

	return newUiState;

}
