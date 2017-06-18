import {ApplicationState} from "../store/application-state";

export function mapStateToAccountKeysSelector(state: ApplicationState): string[] {

	return state.accountData.accountKeys;

}
