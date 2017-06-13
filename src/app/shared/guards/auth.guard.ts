import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {userSelector} from "../../nav/user-selector";
import {User} from "../models/user";
import {Observable} from "rxjs/Observable";
import {AngularFireAuth} from "angularfire2/auth";
import {GetFirebaseUserAction, UpdateUserAction} from "../../store/actions/authActions";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor (
		private auth: AngularFireAuth,
		private store: Store<ApplicationState>,
	    private router: Router
	) {
	}

	canActivate() {
		// Get the auth state, if the user is logged in or not
		return this.auth.authState.map((auth) => {
			if (auth) {
				// If they are, then let them pass and retrieve
				// the firebase user object to update the store
				this.store.dispatch(new GetFirebaseUserAction(auth.uid));
				return true;
			}
			// If not bring them to the landing page
			this.router.navigate(['/']);
			return false;
		}).first();
	}

}
