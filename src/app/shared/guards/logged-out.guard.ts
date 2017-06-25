import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";
@Injectable()
export class LoggedOutGuard implements CanActivate {

	constructor(
		private auth: AngularFireAuth,
		private router: Router
	) {

	}

	canActivate() {
		return this.auth.authState.map((auth) => {
			if (auth) {
				// If the user is authenticated then just redirect
				// to the accounts view. The home canActivate
				// guard will go and retrieve the firebase user object.
				// TODO: change this so that it goes to a homepage view
				this.router.navigate(['/', 'home', 'notes']);
				return false;
			}
			// If the user is not authenticated, then return true for
			// them to enter the landing component.
			return true;
		}).first();
	}

}
