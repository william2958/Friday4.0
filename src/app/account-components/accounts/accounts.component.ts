import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs/Observable";
import {Account} from "../../shared/models/account";
import {userSelector} from "../../nav/user-selector";
import {
	LoadAccountKeysAction, LoadInitialAccountsAction, ShowPinModalAction
} from "../../store/actions/accountActions";
import {User} from "../../shared/models/user";
import {mapStateToAccountKeysSelector, mapStateToAccountsSelector} from "./accountSelectors";
import {ORDER_BY_NEWEST} from "../../services/account.service";
import {Subscription} from "rxjs/Subscription";
import {pinSelector, pinSetSelector} from "../../store/selectors/pinSelector";

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
	accountKeys$: Observable<any[]>;

	// Subscriptions
	userSubscription$: Subscription;
	pinSetSubscription$: Subscription;
	pin$;

	// How to sort the accounts (newest, oldest)
	sortBy: string = ORDER_BY_NEWEST;

	constructor(
		private store: Store<ApplicationState>
	) { }

	ngOnInit() {

		// Set up the initial subscriptions
		this.user$ = this.store.select(userSelector);
		this.pin$ = this.store.select(pinSelector);
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


		// If pin hasn't been set, then get the user to set it.
		this.pinSetSubscription$ = this.store.select(pinSetSelector).subscribe(pinSet => {
			if (!pinSet) {
				this.store.dispatch(new ShowPinModalAction());
			}
		});

	}

	updateSort(event: any) {
		// This will be emitted by the option bar
		this.sortBy = event;
	}

	ngOnDestroy() {
		this.userSubscription$.unsubscribe();
		this.pinSetSubscription$.unsubscribe();
	}

}
