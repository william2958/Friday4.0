import { Component, OnInit } from '@angular/core';
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
	selector: 'new-account',
	templateUrl: './new-account.component.html',
	styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {

	createAccountForm: FormGroup;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private fb: FormBuilder
	) {
		this.createAccountForm = this.fb.group({
			website: ['facebook.com', Validators.required],
			login: ['william2958@gmail.com', Validators.required],
			password: ['password123', Validators.required]
		});
	}

	ngOnInit() {
	}

	createAccount() {

	}

}
