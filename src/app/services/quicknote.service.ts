import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";

@Injectable()
export class QuicknoteService {

	constructor(
		private db: AngularFireDatabase
	) { }

	createQuicknote(email: string, note: string, title?: string) {
		return this.getUserKey(email)
			.switchMap(key => {
				const quicknoteRef = this.db.database.ref(`quicknotes/${key}`);
				return quicknoteRef.push({
					title: title || '',
					note: note,
					date_created: (new Date).getTime()
				});
			});
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
