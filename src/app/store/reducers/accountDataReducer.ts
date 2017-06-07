import {AccountData} from "../account-data";
import {Action} from "@ngrx/store";
export function accountData(state: AccountData, action: Action): AccountData {

	switch (action.type) {

		default:
			return state;

	}

}
