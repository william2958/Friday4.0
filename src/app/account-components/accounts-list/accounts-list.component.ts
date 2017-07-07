import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Router} from "@angular/router";
import {DeleteAccountAction} from "../../store/actions/accountActions";
import * as _ from 'lodash';
import {EncryptService} from "../../services/encrypt.service";

@Component({
	selector: 'accounts-list',
	templateUrl: './accounts-list.component.html',
	styleUrls: ['./accounts-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsListComponent implements OnInit, OnChanges {

	@Input() accounts;
	@Input() reverse;
	@Input() userKey: string;
	@Input() pin;
	@Input() sortBy;
	decrypted = false;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private encryptService: EncryptService
	) { }

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {

		if (changes['accounts']) {
			// We will receive a new notes array every time the sort
			// is updated
			if (changes['accounts'].currentValue.length > 0) {
				this.decrypted = false;
				this.decryptPasswords();
				if (this.reverse) {
					this.accounts = _.reverse(_.cloneDeep(this.accounts));
				} else {
					this.accounts = _.cloneDeep(this.accounts);
				}
			}

		}

		if (changes['pin']) {
			// If the pin was changed after initial set
			if (changes['pin'].previousValue === changes['pin'].currentValue) {
				// Get ready to re-decrypt the passwords
				this.decrypted = false;
			} else {
				// The accounts will either be decrypted here or
				// in the accounts subscription depending which finishes
				// last
				this.decryptPasswords();
			}
		}

	}

	goToAccount(payload: any) {
		this.router.navigate(['/', 'home', 'accounts', payload, this.userKey]);
	}

	deleteAccount(key: string) {
		this.store.dispatch(new DeleteAccountAction({
			accountKey: key,
			userKey: this.userKey
		}));
	}

	// Method to decrypt the this.accounts array of account passwords.
	// This will be called only once upon the initialization of this component
	// and checks that there are both accounts and a pin available
	decryptPasswords() {
		// Then decrypt all the account passwords
		if (!this.decrypted && this.accounts.length > 0 && this.pin) {
			this.accounts.map(account => {
				// Decrypt all of the passwords
				account.password = this.encryptService.decryptString(account.password, this.pin);
				return account;
			});
			this.decrypted = true;
		}
	}

}
