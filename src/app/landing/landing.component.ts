import { Component, OnInit } from '@angular/core';
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";
import {AuthService} from "../services/auth.service";
import {SignInEmailAction} from "../store/authActions";

@Component({
	selector: 'landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	constructor(private store: Store<ApplicationState>) {

	}

	ngOnInit() {
	}

	login() {
		this.store.dispatch(new SignInEmailAction({email: 'william2958@gmail.com', password: 'password'}));
	}

}
