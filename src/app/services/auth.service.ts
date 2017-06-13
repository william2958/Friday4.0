import {Injectable} from "@angular/core";
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {AngularFireDatabase} from "angularfire2/database";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {UpdateUserAction, UserSignedInAction} from "../store/actions/authActions";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {

	constructor(
		private auth: AngularFireAuth,
		private db: AngularFireDatabase,
		private store: Store<ApplicationState>,
	    private router: Router
	) { }

	login(email, password) {

		return this.auth.auth.signInWithEmailAndPassword(email, password);

	}

	registerWithFirebaseAuth(email, password, first_name, last_name) {
		return this.auth.auth.createUserWithEmailAndPassword(email, password)
			.then(
				res => {
					const usersRef = this.db.database.ref('users');
					usersRef.child(res.uid).set({
						first_name: first_name,
						last_name: last_name,
						email: email,
						first_time: true,
			            email_confirmed: false,
						date_created: (new Date).getTime()
					});
				}
			);
	}

	logout() {
		this.router.navigate(['']);
		return this.auth.auth.signOut();
	}

	fromFirebaseAuthPromise(promise): Observable<any> {

		const subject = new Subject<any>();

		promise
			.then(res => {
				subject.next(res);
				subject.complete();
			},
			err => {
				subject.error(err);
				subject.complete();
			});

		return subject;

	}

}
