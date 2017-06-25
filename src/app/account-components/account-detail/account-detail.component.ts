import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs/Observable";
import {Account} from "../../shared/models/account";
import {ActivatedRoute, Router} from "@angular/router";
import {
	DeleteAccountAction, LoadSingleAccountAction, ShowPinModalAction,
	UpdateAccountAction
} from "../../store/actions/accountActions";
import {FormBuilder, FormGroup} from "@angular/forms";
import {mapStateToSingleAccountSelector} from "./mapStateToSingleAccountSelector";
import {pinSelector, pinSetSelector} from "../../store/selectors/pinSelector";
import {Subscription} from "rxjs/Subscription";
import {EncryptService} from "../../services/encrypt.service";
import * as _ from 'lodash';
import {mapStateToAccountsSelector} from "../accounts/accountSelectors";


@Component({
	selector: 'account-detail',
	templateUrl: './account-detail.component.html',
	styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit, OnDestroy {

	accountId: string;
	userId: string;
	account: Account;
	accounts$: Observable<Account[]>;

	editAccountForm: FormGroup;

	pinSubscription$: Subscription;
	pinSetSubscription$: Subscription;
	pin: string;
	decrypted = false;

	constructor(
		private store: Store<ApplicationState>,
	    private route: ActivatedRoute,
	    private router: Router,
	    private fb: FormBuilder,
	    private encryptService: EncryptService
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

		this.pinSetSubscription$ = this.store.select(pinSetSelector).subscribe(pinSet => {
			if (!pinSet) {
				this.store.dispatch(new ShowPinModalAction());
			}
		});

		this.pinSubscription$ = this.store.select(pinSelector).subscribe(pin => {
			this.pin = pin;
			this.decryptPassword();
		});

			// Take accounts from the accounts available in the store
		this.accounts$.take(2).subscribe(
			accounts => {

				// This checks if the account was navigated to from the
				// accounts page (meaning that the account is already stored
				// in the store)
				for (const account of accounts) {
					if (account.key === this.accountId) {
						this.account = _.cloneDeep(account);
						this.decryptPassword();
					}
				}

				// If the account still has not been found and needs to be
				// retrieved from the backend
				if (!this.account) {
					this.store.dispatch(new LoadSingleAccountAction({
						userKey: this.userId,
						accountKey: this.accountId
					}));
					this.store.select(mapStateToSingleAccountSelector).take(2).subscribe(
						account => {
							if (account) {
								this.account = _.cloneDeep(account);
								this.decryptPassword();
							}
						}
					).unsubscribe();
				}
			}
		);

	}

	decryptPassword() {
		if (!this.decrypted && this.account && this.pin !== '' && this.pin) {
			this.account.password = this.encryptService.decryptString(this.account.password, this.pin);
			this.setForm();
			this.decrypted = true;
		}
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
			console.log('saving with: ', this.account);
			const encryptedPassword = this.encryptService.encryptString(this.editAccountForm.value.password, this.pin);
			this.store.dispatch(new UpdateAccountAction({
				userKey: this.userId,
				accountData: {
					login: this.editAccountForm.value.login,
					website: this.editAccountForm.value.website,
					account_notes: this.editAccountForm.value.account_notes,
					password: encryptedPassword
				},
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

	ngOnDestroy() {
		this.pinSetSubscription$.unsubscribe();
	}

}
