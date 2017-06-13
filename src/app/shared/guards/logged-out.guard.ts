import {Injectable} from "@angular/core";
import {ActivatedRoute, CanActivate, Router} from "@angular/router";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {UpdateUserAction} from "../../store/actions/authActions";
import {AngularFireAuth} from "angularfire2/auth";
@Injectable()
export class LoggedOutGuard implements CanActivate {

	constructor(
		private auth: AngularFireAuth,
		private store: Store<ApplicationState>,
		private router: Router,
		private route: ActivatedRoute
	) {

	}

	canActivate() {
		return this.auth.authState.map((auth) => {
			if (auth) {
				// This is when the user lands on the blank url
				// So update the store with the new user info
				this.store.dispatch(new UpdateUserAction({
					uid: auth.uid,
					email: auth.email,
					first_name: "william",
					last_name: undefined,
					first_time: undefined,
					date_created: undefined,
					email_verified: auth.emailVerified
				}));
				// Bring the user to the accounts view
				this.router.navigate(['/', 'home', 'accounts']);
				return false;
			}
			// If the user is not authenticated, then return true for
			// them to enter the landing component.
			return true;
		}).first();
	}

}
