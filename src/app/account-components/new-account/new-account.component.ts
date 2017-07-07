import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CreateAccountAction, ShowPinModalAction} from "../../store/actions/accountActions";
import {userKeySelector} from "../../store/selectors/user-key-selector";
import {Observable} from "rxjs/Observable";
import {EncryptService} from "../../services/encrypt.service";
import {pinSelector, pinSetSelector} from "../../store/selectors/pinSelector";
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'new-account',
	templateUrl: './new-account.component.html',
	styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit, OnDestroy {

	createAccountForm: FormGroup;
	userKey$: Observable<string>;
	userKeySubscription$: Subscription;
	userKey: string;
	pinSubscription$: Subscription;
	pinSetSubscription$: Subscription;

	passwordField;
	generatePasswordLength = 12;
	uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
	numbers = "0123456789";
	symbols = "!@#$%^&*?";
	uppercaseChecked = true;
	lowercaseChecked = true;
	numbersChecked = true;
	symbolsChecked = false;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private fb: FormBuilder,
	    private encryptService: EncryptService
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
		this.userKeySubscription$ = this.userKey$.subscribe(
			key => this.userKey = key
		);
		this.pinSetSubscription$ = this.store.select(pinSetSelector).subscribe(pinSet => {
			if (!pinSet) {
				this.store.dispatch(new ShowPinModalAction());
			}
		});
	}

	createAccount() {
		this.pinSubscription$ = this.store.select(pinSelector).subscribe(pin => {
			const encryptedPassword = this.encryptService.encryptString(this.createAccountForm.value.password, pin);
			this.store.dispatch(new CreateAccountAction({
				accountData: {
					login: this.createAccountForm.value.login,
					website: this.createAccountForm.value.website,
					account_notes: this.createAccountForm.value.account_notes,
					password: encryptedPassword
				},
				userKey: this.userKey
			}));
			this.back();
		});
	}

	createPassword(event) {
		let possibleLetters = "";
		if (this.uppercaseChecked) {
			possibleLetters += this.uppercaseLetters;
		}
		if (this.lowercaseChecked) {
			possibleLetters += this.lowercaseLetters;
		}
		if (this.numbersChecked) {
			possibleLetters += this.numbers;
		}
		if (this.symbolsChecked) {
			possibleLetters += this.symbols;
		}
		let text = "";

		for (let i = 0; i < event; i++) {
			text += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
		}

		this.passwordField = text;

	}

	back() {
		this.router.navigate(['', 'home', 'accounts']);
	}

	ngOnDestroy() {
		this.userKeySubscription$.unsubscribe();
		if (this.pinSubscription$) {
			this.pinSubscription$.unsubscribe();
		}
		if (this.pinSetSubscription$) {
			this.pinSetSubscription$.unsubscribe();
		}
	}

}
