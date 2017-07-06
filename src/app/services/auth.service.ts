import {Injectable} from "@angular/core";
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {AngularFireDatabase} from "angularfire2/database";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {GetFirebaseUserAction} from "../store/actions/authActions";
import {Router} from "@angular/router";
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

	constructor(
		private auth: AngularFireAuth,
		private db: AngularFireDatabase,
		private store: Store<ApplicationState>,
	    private router: Router
	) { }

	login(email: string, password: string) {

		return this.auth.auth.signInWithEmailAndPassword(email, password);

	}

	getFirebaseUser(uid: string): Observable<any> {

		return this.db.object('users/' + uid);

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
						// firebase timestamp ensures accurate time sync with firebase
						date_created: firebase.database.ServerValue.TIMESTAMP
					});
					this.store.dispatch(new GetFirebaseUserAction(res.uid));
				}
			);
	}

	loginWithGoogle() {
		return this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}

	getGoogleUser(user) {
		this.db.database.ref('users').child(user.user.uid).once('value', snapshot => {
			if (snapshot.val() !== null) {
				// console.log('user already created');
			} else {
				// console.log('user needs to be created');
				const usersRef = this.db.database.ref('users');
				usersRef.child(user.user.uid).set({
					first_name: user.additionalUserInfo.profile.given_name,
					last_name: user.additionalUserInfo.profile.family_name,
					email: user.additionalUserInfo.profile.email,
					first_time: true,
					email_confirmed: user.additionalUserInfo.profile.verified_email,
					// firebase timestamp ensures accurate time sync with firebase
					date_created: firebase.database.ServerValue.TIMESTAMP
				});
				this.store.dispatch(new GetFirebaseUserAction(user.user.uid));
			}
		});
		return Observable.of(user.user.uid);
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
