import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {AccountService} from "../../services/account.service";
import {Observable} from "rxjs/Observable";
import {Action, Store} from "@ngrx/store";
import {
	ACCOUNT_CREATED_ACTION,
	AccountCreatedAction, AccountsLoadedAction, CREATE_ACCOUNT_ACTION,
	LOAD_ACCOUNTS_ACTION
} from "../actions/accountActions";
import {ACCOUNT_ERROR, ErrorOccurredAction, ShowToastAction, SUCCESS_TOAST} from "../actions/globalActions";
import {ApplicationState} from "../application-state";
import {Router} from "@angular/router";

@Injectable()
export class AccountEffectService {

	constructor(
		private actions$: Actions,
	    private accountService: AccountService,
	    private store: Store<ApplicationState>,
	    private router: Router
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

	@Effect() createAccount$ = this.actions$
		.ofType(CREATE_ACCOUNT_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.createAccount(action.payload.accountData, action.payload.userKey)
			).catch(
				(err) => {
					console.log('error while creating account', err);
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Account Created!']));

}
