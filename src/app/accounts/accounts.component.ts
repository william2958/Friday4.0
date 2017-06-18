import {Component, EventEmitter, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {Observable} from "rxjs/Observable";
import {Account} from "../shared/models/account";
import {userSelector} from "../nav/user-selector";
import {
	LoadAccountKeysAction, LoadAccountsAction, LoadNextAccountsAction,
	LoadPrevAccountsAction
} from "../store/actions/accountActions";
import {mapStateToAccountsSelector, mapStateToCurrentAccountKeySelector} from "./mapStateToAccountsSelector";
import {Router} from "@angular/router";
import {MaterializeAction} from "angular2-materialize";
import {User} from "../shared/models/user";
import {mapStateToAccountKeysSelector} from "./accountSelectors";
import * as _ from 'lodash';
import {ORDER_BY_DATE, ORDER_BY_KEY, ORDER_BY_WEBSITE_NAME} from "../services/account.service";

@Component({
	selector: 'accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

	user$: Observable<User>;
	currentAccountKey$: Observable<string>;
	accounts$: Observable<Account[]>;
	accounts: Account[];
	accountKeys$: Observable<any[]>;
	accountKeys: any[];
	userKey: string;
	searchResults: string[];

	searchModalActions = new EventEmitter<string|MaterializeAction>();

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router
	) { }

	ngOnInit() {

		// Set up the initial subscriptions
		this.user$ = this.store.select(userSelector);
		this.currentAccountKey$ = this.store.select(mapStateToCurrentAccountKeySelector);
		this.accountKeys$ = this.store.select(mapStateToAccountKeysSelector);
		this.accounts$ = this.store.select(mapStateToAccountsSelector);
		this.searchResults = [];
		this.userKey = '';

		// Get the user object so we can use the uid for all account actions
		this.user$.take(2).subscribe(
			user => {
				if (user) {
					this.userKey = user.uid;
					this.accounts$.subscribe(
						accounts => {
							if (accounts.length === 0) {
								// Load new accounts and keys when we don't have an accounts array yet
								console.log('loading new accounts');
								this.store.dispatch(new LoadAccountKeysAction(this.userKey));
								this.store.dispatch(new LoadAccountsAction(this.userKey));
							}
						}
					).unsubscribe();
				}
			}
		);

		this.accountKeys$.take(2).subscribe(
			keys => {
				this.accountKeys = keys;
			}
		);

		this.accounts$.subscribe(
			accounts => {
				this.accounts = accounts;
				console.log('accounts: ', accounts);
			}
		);

	}

	addAccount() {
		this.router.navigate(['/', 'home', 'accounts', 'new']);
	}

	goToAccount(key: string) {
		this.router.navigate(['/', 'home', 'accounts', key, this.userKey]);
	}

	showSearch() {
		this.searchModalActions.emit({action: 'modal', params: ['open']});
	}

	search(searchTerms: string) {
		this.searchResults = _.filter(this.accountKeys, (val) => {
			return val.value.indexOf(searchTerms) !== -1;
		});
	}

	showDetail(result) {
		this.router.navigate(['/', 'home', 'accounts', result.key, this.userKey]);
		this.searchModalActions.emit({action: 'modal', params: ['close']});
	}

	prevPage() {
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

	nextPage() {
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
