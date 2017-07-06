import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {QuicknoteService} from "../../services/quicknote.service";
import {Observable} from "rxjs/Observable";
import {Action, Store} from "@ngrx/store";
import {
	CREATE_QUICKNOTE_ACTION, DELETE_ALL_QUICKNOTES_ACTION, DELETE_QUICKNOTE_ACTION, LOAD_QUICKNOTES_ACTION,
	QuicknotesLoadedAction
} from "../actions/quicknoteActions";
import {ErrorOccurredAction, QUICKNOTE_ERROR, ShowToastAction,
	SUCCESS_TOAST
} from "../actions/globalActions";
import {ApplicationState} from "../application-state";

@Injectable()
export class QuicknoteEffectService {

	constructor(
		private actions$: Actions,
	    private quicknoteService: QuicknoteService,
	    private store: Store<ApplicationState>
	) { }

	@Effect() getQuicknotes$ = this.actions$
		.ofType(LOAD_QUICKNOTES_ACTION)
		.switchMap(action => this.quicknoteService.getQuicknotes(action.payload))
		.map(quicknotes => new QuicknotesLoadedAction(quicknotes))
		.catch(
			(err) => {
				if (err.code !== 'PERMISSION_DENIED') {
					this.store.dispatch(new ErrorOccurredAction({
						type: QUICKNOTE_ERROR,
						message: err.message
					}));
				}
				return Observable.empty();
			}
		);

	@Effect() createQuicknote$: Observable<Action> = this.actions$
		.ofType(CREATE_QUICKNOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.quicknoteService.createQuicknote(action.payload.email, action.payload.body)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: QUICKNOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(result => new ShowToastAction([SUCCESS_TOAST, 'Quicknote Created!']));


	@Effect() deleteQuicknote$: Observable<Action> = this.actions$
		.ofType(DELETE_QUICKNOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.quicknoteService.deleteQuicknote(action.payload.userKey, action.payload.quicknoteKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: QUICKNOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(res => new ShowToastAction([SUCCESS_TOAST, 'Quicknote Deleted!']));

	@Effect() deleteAllQuicknote$: Observable<Action> = this.actions$
		.ofType(DELETE_ALL_QUICKNOTES_ACTION)
		.switchMap(action => Observable
			.from(
				this.quicknoteService.deleteAllQuicknotes(action.payload)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: QUICKNOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(res => new ShowToastAction([SUCCESS_TOAST, 'All Quicknotes Deleted!']));

}
