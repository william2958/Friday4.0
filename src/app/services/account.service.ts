import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";
import {Account} from "../shared/models/account";

export const ACCOUNTS_PAGE_SIZE = 5;

@Injectable()
export class AccountService {

	constructor(
		private db: AngularFireDatabase
	) { }

	getAccounts(userKey: string) {
		// Load the first page of accounts
		return this.loadFirstPageAccounts(userKey, ACCOUNTS_PAGE_SIZE);
	}

	// Function to load the first page of accounts
	loadFirstPageAccounts(userKey: string, pageSize: number): Observable<Account[]> {

		// Get the account keys observable
		const firstPageAccountKeys$ = this.findAccountKeys(userKey, {
			query: {
				limitToFirst: pageSize
			}
		});

		// Once we have the account keys we go find the accounts associated to them.
		return this.findAccountsForAccountKeys(firstPageAccountKeys$);

	}

	// Get the account keys from the accountsPerUser node. Goes off of
	// the userKey and a query object that can be used for pagination
	findAccountKeys(userKey: string, query: FirebaseListFactoryOpts = {}): Observable<string[]> {
		return this.db.list('accountsPerUser/' + userKey, query)
			// This list command will return an array of Objects. Each object
			// represents the key and value of the accountsPerUser data. Eg:
			// {$value: 'spotify', $key: '-KmTA00WL2..'}
			.map(accountPerUser => {
				// This value that is passed in is the array of objects
				// So we must map through each element in that array to get it's $key and return it.
				return accountPerUser.map(account => account.$key);
			});
	}

	// Find the array of accounts for a specific array of account keys
	findAccountsForAccountKeys(accountKeys$: Observable<string[]>): Observable<Account[]> {
		return accountKeys$
			.map(accounts => {
				// This is the array of keys
				return accounts.map(accountKey => {
					// Run through each account key and return the object
					// of the account in the accounts node
					return this.db.object('accounts/' + accountKey);
				});
			})
			.flatMap(firebaseObjectObservables => Observable.combineLatest(firebaseObjectObservables));
	}

}
