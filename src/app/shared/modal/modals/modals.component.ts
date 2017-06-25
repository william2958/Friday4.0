import {Component, EventEmitter, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {
	loginErrorsSelector, showLoginSelector, showPinSelector, showSignupSelector,
	signupErrorsSelector
} from "./show-selectors";
import {ApplicationState} from "../../../store/application-state";
import {Store} from "@ngrx/store";
import {SignInEmailAction, SignupAction} from "../../../store/actions/authActions";
import {userSelector} from "../../../nav/user-selector";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
	ClearErrorAction, LOGIN_ERROR, SetPinAction, ShowToastAction, SIGNUP_ERROR,
	SUCCESS_TOAST
} from "../../../store/actions/globalActions";
import {User} from "../../models/user";
import {MaterializeAction} from "angular2-materialize";
import {pinSetSelector} from "../../../store/selectors/pinSelector";

@Component({
	selector: 'modals',
	templateUrl: './modals.component.html',
	styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

	showLoginModal$: Observable<boolean>;
	showSignupModal$: Observable<boolean>;
	showPinModal$: Observable<boolean>;

	loginErrors$: Observable<string[]>;
	signupErrors$: Observable<string[]>;

	loginForm: FormGroup;
	signupForm: FormGroup;

	user$: Observable<User>;

	loginModalActions = new EventEmitter<string|MaterializeAction>();
	signupModalActions = new EventEmitter<string|MaterializeAction>();
	pinModalActions = new EventEmitter<string|MaterializeAction>();

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private fb: FormBuilder
	) {
		this.showLoginModal$ = this.store.select(showLoginSelector).skip(1);
		this.showSignupModal$ = this.store.select(showSignupSelector).skip(1);
		this.showPinModal$ = this.store.select(showPinSelector).skip(1);

		this.loginForm = this.fb.group({
			email: ['william2958@gmail.com', Validators.required],
			password: ['password', Validators.required]
		});

		this.signupForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
			first_name: ['', Validators.required],
			last_name: ['', Validators.required]
		});

	}

	ngOnInit() {

		this.showLoginModal$.subscribe(
			() => {
				this.loginModalActions.emit({action: 'modal', params: ['open']});
			}
		);

		this.showSignupModal$.subscribe(
			() => {
				this.signupModalActions.emit({action: 'modal', params: ['open']});
			}
		);

		this.showPinModal$.subscribe(
			() => {
				this.pinModalActions.emit({action: 'modal', params: ['open']});
			}
		);

		this.store.select(pinSetSelector).subscribe(val => {
			if (val) {
				this.pinModalActions.emit({action: 'modal', params: ['close']});
			}
		});

		this.loginErrors$ = this.store.select(loginErrorsSelector);
		this.signupErrors$ = this.store.select(signupErrorsSelector);

	}

	login() {
		this.store.dispatch(new ClearErrorAction(LOGIN_ERROR));
		console.log('Loggin in form: ', this.loginForm.value);
		this.store.dispatch(new SignInEmailAction({
			email: this.loginForm.value.email,
			password: this.loginForm.value.password
		}));
		this.user$ = this.store.select(userSelector);
		this.user$.take(2).subscribe(
			user => {
				if (user) {
					console.log('login successful');
					this.loginModalActions.emit({action: 'modal', params: ['close']});
					this.loginForm.reset();
					this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Login Successful!']));
					this.router.navigate(['home', 'notes']);
				}
			}
		);
	}

	signup() {
		this.store.dispatch(new ClearErrorAction(SIGNUP_ERROR));
		this.store.dispatch(new SignupAction({
			email: this.signupForm.value.email,
			password: this.signupForm.value.password,
			first_name: this.signupForm.value.first_name,
			last_name: this.signupForm.value.last_name
		}));
		this.store.select(userSelector).take(2).subscribe(
			user => {
				console.log('updated from signup', user);
				if (user) {
					this.signupModalActions.emit({action: 'modal', params: ['close']});
					this.signupForm.reset();
					this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Signup Successful!']));
					this.router.navigate(['home', 'accounts']);
				}
			}
		);
	}

	setPin(pin: string) {
		console.log('setting pin: ', pin);
		this.store.dispatch(new SetPinAction(pin));
		this.pinModalActions.emit({action: 'modal', params: ['close']});
	}

	cancelPin() {
		this.pinModalActions.emit({action: 'modal', params: ['close']});
		this.router.navigate(['/', 'home', 'notes']);
	}

	close() {
		this.loginModalActions.emit({action: 'modal', params: ['close']});
		this.signupModalActions.emit({action: 'modal', params: ['close']});
		this.pinModalActions.emit({action: 'modal', params: ['close']});
	}

}
