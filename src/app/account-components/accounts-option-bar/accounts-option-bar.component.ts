import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Account} from "../../shared/models/account";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {ORDER_BY_NEWEST, ORDER_BY_OLDEST} from "../../services/account.service";
import {LoadInitialNotesAction} from "../../store/actions/noteActions";
import {
	LoadInitialAccountsAction, LoadNextAccountsAction,
	LoadPrevAccountsAction
} from "../../store/actions/accountActions";
import * as _ from 'lodash';

@Component({
	selector: 'accounts-option-bar',
	templateUrl: './accounts-option-bar.component.html',
	styleUrls: ['./accounts-option-bar.component.css']
})
export class AccountsOptionBarComponent implements OnInit {

	@Input() accounts: Account[];
	@Input() sortBy;
	@Input() accountKeys: any[];
	@Input() userKey;
	@Output() updateSort = new EventEmitter();

	constructor(
		private store: Store<ApplicationState>
	) { }

	ngOnInit() {
	}

	changeSort(event: any) {
		// Emit the change in ordering
		if (event === 'oldest') {
			this.updateSort.emit(ORDER_BY_OLDEST);
		} else {
			this.updateSort.emit(ORDER_BY_NEWEST);
		}
		// Fetch another set of notes
		this.store.dispatch(new LoadInitialAccountsAction({
			userKey: this.userKey,
			sortBy: this.sortBy
		}));
	}

	prevPage() {
		if (this.sortBy === ORDER_BY_NEWEST) {
			if (_.last(this.accounts).key === _.last(this.accountKeys).key) {
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

}
