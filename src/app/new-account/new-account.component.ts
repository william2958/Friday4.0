import { Component, OnInit } from '@angular/core';
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CreateAccountAction} from "../store/actions/accountActions";
import {userKeySelector} from "../store/selectors/user-key-selector";
import {Observable} from "rxjs/Observable";

@Component({
	selector: 'new-account',
	templateUrl: './new-account.component.html',
	styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {

	createAccountForm: FormGroup;
	userKey$: Observable<string>;
	userKey: string;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private fb: FormBuilder
	) {
		this.createAccountForm = this.fb.group({
			website: ['', Validators.required],
			login: ['', Validators.required],
			password: ['', Validators.required],
			account_notes: ['', Validators.required]
		});
	}

	ngOnInit() {
		this.userKey$ = this.store.select(userKeySelector);
		this.userKey$.subscribe(
			key => this.userKey = key
		);
	}

	createAccount() {
		this.store.dispatch(new CreateAccountAction({
			accountData: this.createAccountForm.value,
			userKey: this.userKey
		}));
		this.back();
	}

	back() {
		this.router.navigate(['', 'home', 'accounts']);
	}

}
