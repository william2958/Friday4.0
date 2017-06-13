import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {userSelector} from "../../nav/user-selector";
import {User} from "../models/user";
import {Observable} from "rxjs/Observable";
import {AngularFireAuth} from "angularfire2/auth";
import {UpdateUserAction} from "../../store/actions/authActions";

@Injectable()
export class AuthGuard implements CanActivate {

	user$: Observable<User>;

	constructor (
		private auth: AngularFireAuth,
		private store: Store<ApplicationState>,
	    private router: Router
	) {
		this.user$ = this.store.select(userSelector);
	}

	canActivate() {
		// Get the auth state, if the user is logged in or not
		return this.auth.authState.map((auth) => {
			if (auth) {
				// If they are, then let them pass
				// and update the store
				this.store.dispatch(new UpdateUserAction({
					uid: auth.uid,
					email: auth.email,
					first_name: "william",
					last_name: undefined,
					first_time: undefined,
					date_created: undefined,
					email_verified: auth.emailVerified
				}));
				return true;
			}
			// If not bring them to the landing page
			this.router.navigate(['/']);
			return false;
		}).first();
	}

}
