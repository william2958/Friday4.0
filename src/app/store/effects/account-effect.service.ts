import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {AccountService} from "../../services/account.service";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {
	AccountKeysLoadedAction,
	AccountsLoadedAction, CREATE_ACCOUNT_ACTION, DELETE_ACCOUNT_ACTION, GET_ACCOUNT_KEYS_ACTION, LOAD_INITIAL_ACCOUNTS_ACTION, LOAD_NEXT_ACCOUNTS_ACTION, LOAD_PREV_ACCOUNTS_ACTION,
	LOAD_SINGLE_ACCOUNT_ACTION,
	SingleAccountLoadedAction,
	UPDATE_ACCOUNT_ACTION
} from "../actions/accountActions";
import {ACCOUNT_ERROR, ErrorOccurredAction, ShowToastAction, SUCCESS_TOAST} from "../actions/globalActions";
import {ApplicationState} from "../application-state";

@Injectable()
export class AccountEffectService {

	constructor(
		private actions$: Actions,
	    private accountService: AccountService,
	    private store: Store<ApplicationState>
	) { }

	// This effect will actually get triggered by firebase updates
	// because this.accountService.getAccounts will actually return
	// an observable that can be updated. Every time the firebase
	// database is updated, by create or update, the AccountsLoadedAction
	// will be updated.

	@Effect() getInitialAccounts$ = this.actions$
		.ofType(LOAD_INITIAL_ACCOUNTS_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.getInitialAccounts(action.payload.userKey, action.payload.sortBy)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(accounts => new AccountsLoadedAction(accounts));

	@Effect() getNextAccounts$ = this.actions$
		.ofType(LOAD_NEXT_ACCOUNTS_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.loadNextPage(action.payload.userKey, action.payload.currentAccountKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(accounts => new AccountsLoadedAction(accounts));

	@Effect() getPrevAccounts$ = this.actions$
		.ofType(LOAD_PREV_ACCOUNTS_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.loadPrevPage(action.payload.userKey, action.payload.currentAccountKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(accounts => new AccountsLoadedAction(accounts));

	@Effect() getSingleAccount$ = this.actions$
		.ofType(LOAD_SINGLE_ACCOUNT_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.loadSingleAccount(action.payload.accountKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(account => new SingleAccountLoadedAction(account));

	// This effect will actually get triggered by firebase updates
	// because this.accountService.getAccounts will actually return
	// an observable that can be updated. Every time the firebase
	// database is updated, by create or update, the AccountsLoadedAction
	// will be updated.
	@Effect() getAccountKeys$ = this.actions$
		.ofType(GET_ACCOUNT_KEYS_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.getAccountKeys(action.payload)
			).catch(
				(err) => {
					if (err.code !== 'PERMISSION_DENIED') {
						this.store.dispatch(new ErrorOccurredAction({
							type: ACCOUNT_ERROR,
							message: err.message
						}));
					}
					return Observable.empty();
				}
			)
		).map(accountKeys => new AccountKeysLoadedAction(accountKeys));

	@Effect() createAccount$ = this.actions$
		.ofType(CREATE_ACCOUNT_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.createAccount(action.payload.accountData, action.payload.userKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Account Created!']));


	@Effect() updateAccount$ = this.actions$
		.ofType(UPDATE_ACCOUNT_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.updateAccount(action.payload.accountData, action.payload.userKey, action.payload.accountKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Account Updated!']));

	@Effect() deleteAccount$ = this.actions$
		.ofType(DELETE_ACCOUNT_ACTION)
		.switchMap(action => Observable
			.from(
				this.accountService.deleteAccount(action.payload.userKey, action.payload.accountKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: ACCOUNT_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Account Deleted!']));

}
