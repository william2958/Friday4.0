import {ApplicationState} from "../store/application-state";
import {Account} from "../shared/models/account";
export function mapStateToAccountsSelector(state: ApplicationState): Account[] {

	return state.accountData.accounts;

}

export function mapStateToCurrentAccountKeySelector(state: ApplicationState): string {

	return state.accountData.currentAccountId;

}
