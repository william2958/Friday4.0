import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {AccountService} from "../../services/account.service";
import {Observable} from "rxjs/Observable";
import {Action, Store} from "@ngrx/store";
import {AccountsLoadedAction, LOAD_ACCOUNTS_ACTION} from "../actions/accountActions";
import {ACCOUNT_ERROR, ErrorOccurredAction} from "../actions/globalActions";
import {ApplicationState} from "../application-state";

@Injectable()
export class AccountEffectService {

	constructor(
		private actions$: Actions,
	    private accountService: AccountService,
	    private store: Store<ApplicationState>
	) { }

	@Effect() getAccounts$ = this.actions$
		.ofType(LOAD_ACCOUNTS_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.getAccounts(action.payload)
			).catch(
				(err) => {
					console.log('account error: ', err);
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(accounts => new AccountsLoadedAction(accounts));

}
