import {Component, OnInit} from '@angular/core';
import {ShowLoginModalAction, ShowSignupModalAction} from "../store/actions/authActions";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";

@Component({
	selector: 'nav-bar',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

	constructor(private store: Store<ApplicationState>) {
	}

	ngOnInit() {
	}

	activateLoginModal() {
		this.store.dispatch(new ShowLoginModalAction());
	}

	activateSignupModal() {
		this.store.dispatch(new ShowSignupModalAction());
	}


}
