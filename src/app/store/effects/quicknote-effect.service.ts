import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {QuicknoteService} from "../../services/quicknote.service";
import {Observable} from "rxjs/Observable";
import {Action, Store} from "@ngrx/store";
import {CREATE_QUICKNOTE_ACTION} from "../actions/quicknoteActions";
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

	@Effect() createQuicknote$: Observable<Action> = this.actions$
		.ofType(CREATE_QUICKNOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.quicknoteService.createQuicknote(action.payload.email, action.payload.note)
			).catch(
				(err) => {
					console.log('error when creating quicknote');
					this.store.dispatch(new ErrorOccurredAction({
						type: QUICKNOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(result => new ShowToastAction([SUCCESS_TOAST, 'Quick note successfully created!']));

}
