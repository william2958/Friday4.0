import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {SHOW_TOAST_ACTION} from "../actions/globalActions";
import {ToastService} from "../../services/toast.service";

@Injectable()
export class GlobalEffectService {

	constructor(
		private actions$: Actions,
	    private toastService: ToastService
	) {}

	@Effect({dispatch: false}) toast$: Observable<any> = this.actions$
		.ofType(SHOW_TOAST_ACTION)
		.switchMap(action => this.toastService.showToast(action.payload));

}
