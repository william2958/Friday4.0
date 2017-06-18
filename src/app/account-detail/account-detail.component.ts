import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {Observable} from "rxjs/Observable";
import {Account} from "../shared/models/account";
import {mapStateToAccountsSelector} from "../accounts/mapStateToAccountsSelector";
import {ActivatedRoute, Router} from "@angular/router";
import {
	DeleteAccountAction, LoadAccountsAction, LoadSingleAccountAction,
	UpdateAccountAction
} from "../store/actions/accountActions";
import {FormBuilder, FormGroup} from "@angular/forms";
import {mapStateToSingleAccountSelector} from "./mapStateToSingleAccountSelector";


/*
TODO: edit initial account retrieval to go to firebase if account does not
exist inside cached accounts. Currently, if the user searched for an account that was
not inside the initial page, this will not work.
 */
@Component({
	selector: 'account-detail',
	templateUrl: './account-detail.component.html',
	styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {

	accountId: string;
	userId: string;
	account: Account;
	accounts$: Observable<Account[]>;

	editAccountForm: FormGroup;

	constructor(
		private store: Store<ApplicationState>,
	    private route: ActivatedRoute,
	    private router: Router,
	    private fb: FormBuilder
	) {
	}

	ngOnInit() {

		this.accountId = this.route.snapshot.params['accountId'];
		this.userId = this.route.snapshot.params['userId'];
		this.accounts$ = this.store.select(mapStateToAccountsSelector);

		this.editAccountForm = this.fb.group({
			website: [''],
			login: [''],
			password: [''],
			account_notes: ['']
		});

		// Take accounts from the accounts available in the store
		this.accounts$.take(2).subscribe(
			accounts => {

				for (const account of accounts) {
					if (account.key === this.accountId) {
						// console.log('account found on current page', account);
						this.account = account;
						this.setForm();
					}
				}

				// If the account still has not been found
				if (!this.account) {
					console.log('account has not been found yet.');
					this.store.dispatch(new LoadSingleAccountAction({
						userKey: this.userId,
						accountKey: this.accountId
					}));
					// TODO: this is unecessarily setting the account four times
					this.store.select(mapStateToSingleAccountSelector).take(2).subscribe(
						account => {
							if (account) {
								// console.log('setting account detail account: ', account);
								this.account = account;
								this.setForm();
							}
						}
					);
				}
			}
		);

	}

	setForm() {
		this.editAccountForm.setValue({
			website: this.account.website,
			login: this.account.login,
			password: this.account.password,
			account_notes: this.account.account_notes
		});
	}

	saveAccount() {
		if (
			this.account.website === this.editAccountForm.value.website &&
			this.account.login === this.editAccountForm.value.login &&
			this.account.password === this.editAccountForm.value.password &&
			this.account.account_notes === this.editAccountForm.value.account_notes
		) {
			console.log('account the same.');
		} else {
			this.store.dispatch(new UpdateAccountAction({
				userKey: this.userId,
				accountData: this.editAccountForm.value,
				accountKey: this.account.key
			}));
		}
	}

	deleteAccount() {
		this.store.dispatch(new DeleteAccountAction({
			accountKey: this.account.key,
			userKey: this.userId
		}));
		this.router.navigate(['/', 'home', 'accounts']);
	}

	back() {
		this.router.navigate(['', 'home', 'accounts']);
	}

}
