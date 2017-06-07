import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {AuthService} from "../../services/auth.service";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {SIGN_IN_EMAIL_ACTION, UserSignedInAction} from "../authActions";

@Injectable()
export class SignInEffectService {

	constructor(private actions$: Actions, private authService: AuthService) {}

	@Effect() signInEmail$: Observable<Action> = this.actions$
		.ofType(SIGN_IN_EMAIL_ACTION)
		.switchMap(action => this.authService.login(action.payload.email, action.payload.password))
		.do(result => console.log('The result from loggin in to firebase in effect is: ', result))
		.map(response => new UserSignedInAction({
			$key: response.uid,
			email: response.email,
			first_name: response,
			last_name: undefined,
			first_time: undefined,
			date_created: undefined,
			email_verified: response.emailVerified
		}));


}
