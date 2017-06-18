import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";
import {Account} from "../shared/models/account";
import {CreateAccountModel} from "../shared/models/createAccount";
import {Subject} from "rxjs/Subject";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {mapStateToAccountKeysSelector} from "../accounts/accountSelectors";

export const ACCOUNTS_PAGE_SIZE = 10;
export const ORDER_BY_KEY = 'ORDER_BY_KEY';
export const ORDER_BY_DATE = 'ORDER_BY_DATE';
export const ORDER_BY_WEBSITE_NAME = 'ORDER_BY_WEBSITE_NAME';

@Injectable()
export class AccountService {

	constructor(
		private db: AngularFireDatabase,
	) { }

	getInitialAccounts(userKey: string) {
		// Load the first page of accounts
		return this.loadFirstPageAccounts(userKey, ACCOUNTS_PAGE_SIZE);
	}

	// Accepts the user key and the currently shown last account key
	loadNextPage(userKey: string, currentAccountKey: string) {

		const nextPageKeys$ = this.findAccountKeys(userKey, {
			query: {
				orderByKey: true,
				startAt: currentAccountKey,
				limitToFirst: ACCOUNTS_PAGE_SIZE + 1
			}
		});

		return this.findAccountsForAccountKeys(nextPageKeys$)
			// Remove the first one because that one is the last one currently
			// being shown
			.map(accounts => accounts.slice(1, accounts.length));
	}

	loadPrevPage(userKey: string, currentAccountKey: string) {

		const prevPageKeys$ = this.findAccountKeys(userKey, {
			query: {
				orderByKey: true,
				endAt: currentAccountKey,
				limitToLast: ACCOUNTS_PAGE_SIZE + 1
			}
		});

		return this.findAccountsForAccountKeys(prevPageKeys$)
			// Remove the last account returned because that is the last one
			// currently being shown
			.map(accounts => accounts.slice(0, accounts.length - 1));
	}

	loadSingleAccount(accountKey: string) {
		return this.db.object('accounts/' + accountKey);
	}

	getAccountKeys(userKey: string) {

		// Returns object map of key and value of all the accountsPerUser
		// for the userKey user
		return this.db.list('accountsPerUser/' + userKey)
			.map(accountPerUser => {
				// This value that is passed in is the array of objects
				// So we must map through each element in that array to get it's key
				// and value and return it.
				return accountPerUser.map(accountKey => {
					return {
						key: accountKey.$key,
						value: accountKey.$value
					};
				});
			});
	}



	// CRUD



	createAccount(accountData: CreateAccountModel, userKey: string) {
		const accountsToSave = Object.assign({}, accountData, {userKey});
		const newAccountKey = this.db.database.ref().child('accounts').push().key;
		const dataToSave = {};

		dataToSave['accounts/' + newAccountKey] = {
			login: accountsToSave.login,
			password: accountsToSave.password,
			website: accountsToSave.website,
			account_notes: accountsToSave.account_notes,
			date_created: (new Date).getTime()
		};
		dataToSave['accountsPerUser/' + userKey + '/' + newAccountKey] = accountsToSave.website;

		return this.firebaseUpdate(dataToSave);
	}

	updateAccount(accountData: CreateAccountModel, userKey: string, accountKey: string) {
		const dataToSave = {};

		dataToSave['account'] = {
			login: accountData.login,
			password: accountData.password,
			website: accountData.website,
			account_notes: accountData.account_notes
		};

		dataToSave['accountKey'] = accountKey;

		dataToSave['userKey'] = userKey;

		return this.firebaseUpdateAccount(dataToSave);
	}

	deleteAccount(userKey: string, accountKey: string) {

		const dataToSave = {};

		dataToSave['accounts/' + accountKey] = null;
		dataToSave['accountsPerUser/' + userKey + '/' + accountKey] = null;

		return this.firebaseUpdate(dataToSave);
	}



	// FIREBASE INTERACTION METHODS BELOW



	// Function to load the first page of accounts
	loadFirstPageAccounts(userKey: string, pageSize: number, orderBy?: string): Observable<Account[]> {

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

	firebaseUpdate(dataToSave) {

		const subject = new Subject();

		this.db.database.ref().update(dataToSave)
			.then(
				val => {
					subject.next(val);
					subject.complete();
				},
				err => {
					subject.error(err);
					subject.complete();
				}
			);

		return subject.asObservable();

	}

	firebaseUpdateAccount(dataToSave) {

		const subject = new Subject();

		this.db.database.ref('accounts').child(dataToSave['accountKey'])
			.update(dataToSave['account'])
			.then(
				val => {
					subject.next(val);
					subject.complete();
				},
				err => {
					subject.error(err);
					subject.complete();
				}
			);

		this.db.database.ref('accountsPerUser' + '/' + dataToSave.userKey + '/' + dataToSave.accountKey)
			.set(dataToSave.account.website);

		return subject.asObservable();

	}

}
