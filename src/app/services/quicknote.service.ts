import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import * as firebase from 'firebase';
import {Subscription} from "rxjs/Subscription";
import {ErrorOccurredAction, QUICKNOTE_ERROR} from "../store/actions/globalActions";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";

@Injectable()
export class QuicknoteService {

	constructor(
		private db: AngularFireDatabase
	) { }

	getQuicknotes(userKey: string) {
		return this.db.list('quicknotes/' + userKey);
	}

	createQuicknote(email: string, body: string) {
		return this.getUserKey(email)
			.switchMap(key => {
				const quicknoteRef = this.db.database.ref(`quicknotes/${key}`);
				return quicknoteRef.push({
					body: body,
					// firebase timestamp ensures accurate time sync with firebase
					date_created: firebase.database.ServerValue.TIMESTAMP
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
