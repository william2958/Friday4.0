import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {Observable} from "rxjs/Observable";
import {Account} from "../shared/models/account";
import {userSelector} from "../nav/user-selector";
import {LoadAccountsAction} from "../store/actions/accountActions";
import {mapStateToAccountsSelector} from "./mapStateToAccountsSelector";
import {Router} from "@angular/router";

@Component({
	selector: 'accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

	accounts$: Observable<Account[]>;
	userKey: string;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router
	) { }

	ngOnInit() {
		this.store.select(userSelector).take(2).subscribe(
			user => {
				if (user) {
					this.userKey = user.uid;
					this.store.dispatch(new LoadAccountsAction(this.userKey));
				} else {
					this.userKey = '';
				}
			}
		);
		this.accounts$ = this.store.select(mapStateToAccountsSelector);
	}

	addAccount() {
		this.router.navigate(['/', 'home', 'newAccount']);
	}

}
