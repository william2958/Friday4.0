import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ERROR_TOAST, SUCCESS_TOAST, WARNING_TOAST} from "../store/actions/globalActions";
declare const Materialize: any;

@Injectable()
export class ToastService {

	constructor() {}

	showToast(input) {

		switch (input[0]) {

			case SUCCESS_TOAST:
				Materialize.toast(input[1] || '', 1000, 'success-toast');
				break;

			case WARNING_TOAST:
				Materialize.toast(input[1] || '', 1000, 'warning-toast');
				break;

			case ERROR_TOAST:
				Materialize.toast(input[1] || '', 1000, 'error-toast');
				break;

		}


		return Observable.empty();
	}

}
