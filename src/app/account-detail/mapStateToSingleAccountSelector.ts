import {ApplicationState} from "../store/application-state";
import {Account} from "../shared/models/account";

export function mapStateToSingleAccountSelector(state: ApplicationState): Account {

	return state.accountData.currentAccount;

}
