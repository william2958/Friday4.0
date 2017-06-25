import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class QuicknoteService {

	constructor(
		private db: AngularFireDatabase
	) { }

	getQuicknotes(userKey: string) {
		console.log('getting quicknotes in service');
		return this.db.list('quicknotes/' + userKey);
	}

	createQuicknote(email: string, body: string) {
		return this.getUserKey(email)
			.switchMap(key => {
				const quicknoteRef = this.db.database.ref(`quicknotes/${key}`);
				console.log('ref: ', body)
				return quicknoteRef.push({
					body: body,
					date_created: (new Date).getTime()
				});
			});
	}

	deleteQuicknote(userKey: string, quicknoteKey: string) {

		return this.db.database.ref('quicknotes/' + userKey + '/' + quicknoteKey).remove();

	}

	deleteAllQuicknotes(userKey: string) {

		return this.db.database.ref('quicknotes/' + userKey).remove();

	}

	getUserKey(email: string): Observable<string> {
		return this.db.list('users', {
			query: {
				orderByChild: 'email',
				equalTo: email
			}
		}).map(results => results[0].$key)
			.catch(() => Observable.throw({message: 'Account does not exist!'}));
	}

}
