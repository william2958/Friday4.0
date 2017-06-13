import {ApplicationState} from "../store/application-state";
import {Account} from "../shared/models/account";
export function mapStateToAccountsSelector(state: ApplicationState): Account[] {

	return state.accountData.accounts;

}
