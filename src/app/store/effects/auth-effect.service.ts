import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {AuthService} from "../../services/auth.service";
import {Action, Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {
	GET_FIREBASE_USER_ACTION, GetFirebaseGoogleUserAction,
	GetFirebaseUserAction,
	SIGN_IN_EMAIL_ACTION, SIGN_IN_GOOGLE_ACTION, SIGN_OUT_ACTION, SignedOutAction, SIGNUP_ACTION,
	UserSignedInAction, GET_FIREBASE_GOOGLE_USER_ACTION, USER_SIGNED_IN_ACTION
} from "../actions/authActions";
import {ApplicationState} from "../application-state";
import {ErrorOccurredAction, LOGIN_ERROR, SIGNUP_ERROR} from "../actions/globalActions";
import {QuicknoteService} from "../../services/quicknote.service";

@Injectable()
export class AuthEffectService {

	constructor(
		private actions$: Actions,
		private authService: AuthService,
	    private quicknoteService: QuicknoteService,
	    private store: Store<ApplicationState>
	) {}

	// This effect is triggered when the user logs into the website.
	// Will trigger the getFirebaseUser$ effect when the user has successfully
	// logged in.
	@Effect() signInEmail$: Observable<Action> = this.actions$
		.ofType(SIGN_IN_EMAIL_ACTION)
		.switchMap(action => Observable
			.from(
				this.authService.login(action.payload.email, action.payload.password)
			).catch(
				(err) => {
					if (err.code === 'auth/user-not-found') {
						this.store.dispatch(new ErrorOccurredAction({
							type: LOGIN_ERROR,
							message: 'Account not found'
						}));
					} else if (err.code === 'auth/wrong-password') {
						this.store.dispatch(new ErrorOccurredAction({
							type: LOGIN_ERROR,
							message: 'Invalid password or user does not exist'
						}));
					} else {
						this.store.dispatch(new ErrorOccurredAction({
							type: LOGIN_ERROR,
							message: err.message
						}));
					}
					return Observable.empty();
				}
			)
		).map(response => {
			// Once logged in, go get the firebase instance of the user
			return new GetFirebaseUserAction(response.uid);
		});

	@Effect() signInGoogle$: Observable<Action> = this.actions$
		.ofType(SIGN_IN_GOOGLE_ACTION)
		.switchMap(action => Observable
			.from(
				this.authService.loginWithGoogle()
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: LOGIN_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(response => {
			// Once logged in, go get the firebase instance of the user
			return new GetFirebaseGoogleUserAction(response);
		});

	@Effect() getGoogleUser$: Observable<Action> = this.actions$
		.ofType(GET_FIREBASE_GOOGLE_USER_ACTION)
		.switchMap(action => Observable
			.from(
				this.authService.getGoogleUser(action.payload)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: LOGIN_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(response => {
			return new GetFirebaseUserAction(response);
		});

	// This effect gets the firebase user object from firebase.
	// This calls the UserSignedInAction to update the user in the store.
	@Effect() getFirebaseUser$: Observable<Action> = this.actions$
		.ofType(GET_FIREBASE_USER_ACTION)
		.switchMap(action => Observable
			.from(
				this.authService.getFirebaseUser(action.payload)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: LOGIN_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(response => new UserSignedInAction({
			uid: response.$key,
			email: response.email,
			first_name: response.first_name,
			last_name: response.last_name,
			date_created: response.date_created,
			first_time: response.first_time,
			email_confirmed: response.email_confirmed
		}));

	// This effect is called when the user signs up for an account.
	// does not return anything currently because it is all handled
	// in the service call.
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
					this.store.dispatch(new ErrorOccurredAction({
						type: SIGNUP_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		);

	// An effect to handling signing out of the website.
	@Effect() signOut$: Observable<Action> = this.actions$
		.ofType(SIGN_OUT_ACTION)
		.switchMap(action => this.authService.logout())
		.map(res => new SignedOutAction());


}
