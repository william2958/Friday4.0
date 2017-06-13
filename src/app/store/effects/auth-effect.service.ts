import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {AuthService} from "../../services/auth.service";
import {Action, Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {
	SIGN_IN_EMAIL_ACTION, SIGN_OUT_ACTION, SignedOutAction, SIGNUP_ACTION,
	UserSignedInAction
} from "../actions/authActions";
import {ApplicationState} from "../application-state";
import {ErrorOccurredAction, LOGIN_ERROR, SIGNUP_ERROR} from "../actions/globalActions";

@Injectable()
export class AuthEffectService {

	constructor(
		private actions$: Actions,
		private authService: AuthService,
	    private store: Store<ApplicationState>
	) {}

	@Effect() signInEmail$: Observable<Action> = this.actions$
		.ofType(SIGN_IN_EMAIL_ACTION)
		.do(result => console.log('The result from logginn in to firebase in effect is: ', result))
		.switchMap(action => Observable
			.from(
				this.authService.login(action.payload.email, action.payload.password)
			).catch(
				(err) => {
					console.log('login error: ', err);
					this.store.dispatch(new ErrorOccurredAction({
						type: LOGIN_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(response => new UserSignedInAction({
			uid: response.uid,
			email: response.email,
			first_name: response.first_name,
			last_name: response.last_name,
			first_time: response.first_time,
			date_created: response.date_created,
			email_verified: response.emailVerified
		}));

	@Effect({dispatch: false}) signup$: Observable<any> = this.actions$
		.ofType(SIGNUP_ACTION)
		.switchMap(action => Observable
			.from(
				this.authService.registerWithFirebaseAuth(
					action.payload.email,
					action.payload.password,
					action.payload.first_name,
					action.payload.last_name
				)
			)
			.catch(
				(err) => {
					console.log('signup error: ', err);
					this.store.dispatch(new ErrorOccurredAction({
						type: SIGNUP_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		);

	@Effect() signOut$: Observable<Action> = this.actions$
		.ofType(SIGN_OUT_ACTION)
		.switchMap(action => this.authService.logout())
		.map(res => new SignedOutAction());


}
