import {Injectable} from "@angular/core";
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthService {

	constructor(private auth: AngularFireAuth) { }

	login(email, password) {

		return this.auth.auth.signInWithEmailAndPassword(email, password);

	}

	signUp(email, password) {
		return this.auth.auth.createUserWithEmailAndPassword(email, password);
	}

	logout() {
		this.auth.auth.signOut();
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
