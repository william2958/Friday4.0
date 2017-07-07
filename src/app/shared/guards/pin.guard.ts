import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {pinSetSelector} from "../../store/selectors/pinSelector";
import {ShowPinModalAction} from "../../store/actions/accountActions";

@Injectable()
export class PinGuard implements CanActivate {

	constructor (
		private store: Store<ApplicationState>
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		return this.store.select(pinSetSelector).first().map(set => {
			if (set) {
				return true;
			} else {
				console.log('not set');
				this.store.dispatch(new ShowPinModalAction());
				return true;
			}
		});

		// return this.loginService.isLoggedIn().map(e => {
		// 	if (e) {
		// 		return true;
		// 	}
		// }).catch(() => {
		// 	this.router.navigate(['/login']);
		// 	return Observable.of(false);
		// });


	}

}
