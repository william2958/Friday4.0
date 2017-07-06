import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {AngularFireAuth} from "angularfire2/auth";
import {GetFirebaseUserAction} from "../../store/actions/authActions";
import {ERROR_TOAST, ShowToastAction} from "../../store/actions/globalActions";

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
			this.store.dispatch(new ShowToastAction([ERROR_TOAST, 'User not authenticated!']));
			this.router.navigate(['/']);
			return false;
		}).first();
	}

}
