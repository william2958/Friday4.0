import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs/Observable";
import {Account} from "../../shared/models/account";
import {userSelector} from "../../nav/user-selector";
import {
	LoadAccountKeysAction, LoadInitialAccountsAction, LoadNextAccountsAction,
	LoadPrevAccountsAction, ShowPinModalAction
} from "../../store/actions/accountActions";
import {Router} from "@angular/router";
import {User} from "../../shared/models/user";
import {mapStateToAccountKeysSelector, mapStateToAccountsSelector,
	mapStateToCurrentAccountKeySelector} from "./accountSelectors";
import * as _ from 'lodash';
import {ACCOUNTS_PAGE_SIZE, ORDER_BY_NEWEST} from "../../services/account.service";
import {Subscription} from "rxjs/Subscription";
import {pinSelector, pinSetSelector} from "../../store/selectors/pinSelector";
import {EncryptService} from "../../services/encrypt.service";

@Component({
	selector: 'accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

	user$: Observable<User>;
	userKey = '';

	// Subscription is so that we can unsubscribe to accounts$ when
	// we leave the page, viewAccounts is for the component to load
	// accounts in the view and accounts is for next page prev page
	accounts$: Observable<Account[]>;
	accounts: Account[] = [];
	viewAccounts: Account[];

	currentAccountKey$: Observable<string>;

	accountKeys$: Observable<any[]>;
	accountKeys: any[];

	// Subscriptions
	userSubscription$: Subscription;
	accountsSubscription$: Subscription;
	accountKeysSubscription$: Subscription;
	pinSubscription$: Subscription;
	pinSetSubscription$: Subscription;

	// String of results to display from searching
	searchResults: string[] = [];

	// How to sort the accounts (newest, oldest)
	sortBy: string = ORDER_BY_NEWEST;

	numPages: any[];
	decrypted = false;
	pin = '';
	hoveredResult;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
		private encryptService: EncryptService
	) { }

	ngOnInit() {

		// Set up the initial subscriptions
		this.user$ = this.store.select(userSelector);
		this.currentAccountKey$ = this.store.select(mapStateToCurrentAccountKeySelector);
		this.accountKeys$ = this.store.select(mapStateToAccountKeysSelector);
		this.accounts$ = this.store.select(mapStateToAccountsSelector);

		// Get the user object so we can use the uid for all account actions
		this.userSubscription$ = this.user$.subscribe(
			user => {
				if (user) {
					this.userKey = user.uid;
					this.accounts$.subscribe(
						accounts => {
							if (accounts.length === 0) {
								// Load new accounts and keys when we don't have an accounts array yet
								this.store.dispatch(new LoadAccountKeysAction(this.userKey));
								this.store.dispatch(new LoadInitialAccountsAction({
									userKey: this.userKey,
									sortBy: this.sortBy
								}));
							}
						}
					).unsubscribe();
				}
			}
		);

		this.accountKeysSubscription$ = this.accountKeys$.subscribe(
			keys => {
				this.accountKeys = _.cloneDeep(keys);
				const numberOfPages: number = Math.ceil(this.accountKeys.length / ACCOUNTS_PAGE_SIZE);
				this.numPages = Array(numberOfPages).fill(0).map((x, i) => i + 1);
			}
		);

		this.accountsSubscription$ = this.accounts$.subscribe(
			accounts => {
				if (accounts.length > 0) {
					// First make a deep copy of the accounts
					this.accounts = _.cloneDeep(accounts);
					// The accounts will either be decrypted here or
					// in the pin subscription depending which finishes
					// last
					this.decryptPasswords();
				}
			}
		);

		this.pinSubscription$ = this.store.select(pinSelector).subscribe(pin => {
			if (pin) {
				// If the pin was changed after initial set
				if (pin && this.pin) {
					// Get ready to re-decrypt the passwords
					this.decrypted = false;
					// Set the new pin
					this.pin = pin;
					// Get the passwords again
					this.store.dispatch(new LoadInitialAccountsAction({
						userKey: this.userKey,
						sortBy: this.sortBy
					}));
				} else {
					this.pin = pin;
					// The accounts will either be decrypted here or
					// in the accounts subscription depending which finishes
					// last
					this.decryptPasswords();
				}

			}
		});

		// If pin hasn't been set, then get the user to set it.
		this.pinSetSubscription$ = this.store.select(pinSetSelector).subscribe(pinSet => {
			if (!pinSet) {
				this.store.dispatch(new ShowPinModalAction());
			}
		});

	}

	// Method to decrypt the this.accounts array of account passwords.
	// This will be called only once upon the initialization of this component
	// and checks that there are both accounts and a pin available
	decryptPasswords() {
		// Then decrypt all the account passwords
		if (!this.decrypted && this.accounts.length > 0 && this.pin !== '') {
			console.log('decrypting passwords: ', _.cloneDeep(this.accounts));
			this.accounts.map(account => {
				// Decrypt all of the passwords
				account.password = this.encryptService.decryptString(account.password, this.pin);
				return account;
			});
			// Sort the accounts
			if (this.accounts.length > 0) {
				if (this.sortBy === ORDER_BY_NEWEST) {
					// If we need to flip the accounts
					this.viewAccounts = _.cloneDeep(this.accounts);
					this.viewAccounts = _.reverse(this.viewAccounts);
				} else {
					// If the accounts are good as is
					this.viewAccounts = _.cloneDeep(this.accounts);
				}
			}
			this.decrypted = true;
		}
	}

	addAccount() {
		this.router.navigate(['/', 'home', 'accounts', 'new']);
	}

	goToAccount(key: string) {
		this.router.navigate(['/', 'home', 'accounts', key, this.userKey]);
	}

	// Close the search results
	closeSearch() {
		this.searchResults = [];
	}

	// This gets called every time a user enters a key into the search box
	search(searchTerms: string) {
		if (searchTerms !== '') {
			this.searchResults = _.filter(this.accountKeys, (val) => {
				return val.value.indexOf(searchTerms) !== -1;
			});
		} else {
			this.searchResults = [];
		}
	}

	// Change the hovered item
	changeSearchBackground($event) {
		this.hoveredResult = $event;
	}

	showDetail(result) {
		this.router.navigate(['/', 'home', 'accounts', result.key, this.userKey]);
	}

	prevPage() {
		if (this.sortBy === ORDER_BY_NEWEST) {
			if (_.last(this.accounts).key === _.last(this.accountKeys).key) {
				console.log('cannot go backwards another page.');
			} else {
				if (this.accounts.length > 0) {
					this.store.dispatch(new LoadNextAccountsAction({
						userKey: this.userKey,
						// Pass in the last key of the shown accounts
						currentAccountKey: _.last(this.accounts).key
					}));
				}
			}
		} else {
			if (this.accounts[0].key === this.accountKeys[0].key) {
				console.log('cannot go back another page.');
			} else {
				if (this.accounts.length > 0) {
					this.store.dispatch(new LoadPrevAccountsAction({
						userKey: this.userKey,
						// Pass in the last key of the shown accounts
						currentAccountKey: this.accounts[0].key
					}));
				}
			}
		}
	}

	nextPage() {

		if (this.sortBy === ORDER_BY_NEWEST) {
			// If we're sorting by newest the this.accounts array has already been flipped
			if (this.accounts[0].key === this.accountKeys[0].key) {
				console.log('cannot go forwards another page.');
			} else {
				if (this.accounts.length > 0) {
					this.store.dispatch(new LoadPrevAccountsAction({
						userKey: this.userKey,
						// Pass in the last key of the shown accounts
						currentAccountKey: this.accounts[0].key
					}));
				}
			}
		} else {
			if (_.last(this.accounts).key === _.last(this.accountKeys).key) {
				console.log('cannot go forward another page.');
			} else {
				if (this.accounts.length > 0) {
					this.store.dispatch(new LoadNextAccountsAction({
						userKey: this.userKey,
						// Pass in the last key of the shown accounts
						currentAccountKey: _.last(this.accounts).key
					}));
				}
			}
		}
	}

	ngOnDestroy() {
		this.userSubscription$.unsubscribe();
		this.accountsSubscription$.unsubscribe();
		this.accountKeysSubscription$.unsubscribe();
		this.pinSubscription$.unsubscribe();
		this.pinSetSubscription$.unsubscribe();
	}

}
