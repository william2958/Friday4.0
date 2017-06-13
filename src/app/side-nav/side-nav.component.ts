import { Component, OnInit } from '@angular/core';
import {SignOutAction} from "../store/actions/authActions";
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";

@Component({
	selector: 'side-nav',
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

	constructor(
		private store: Store<ApplicationState>
	) { }

	ngOnInit() {
	}

	logout() {
		this.store.dispatch(new SignOutAction());
	}

}
