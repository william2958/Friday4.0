import {Component, OnInit} from '@angular/core';
import {ShowLoginModalAction, ShowSignupModalAction, SignOutAction} from "../store/actions/authActions";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {Observable} from "rxjs/Observable";
import {User} from "../shared/models/user";
import {userSelector} from "./user-selector";

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
