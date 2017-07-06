import {Component, EventEmitter, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {
	loginErrorsSelector, showLoginSelector, showPinSelector, showSignupSelector,
	signupErrorsSelector
} from "./show-selectors";
import {ApplicationState} from "../../../store/application-state";
import {Store} from "@ngrx/store";
import {SignInEmailAction, SignInGoogleAction, SignupAction} from "../../../store/actions/authActions";
import {userSelector} from "../../../nav/user-selector";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
	ClearErrorAction, ErrorOccurredAction, LOGIN_ERROR, SetPinAction, ShowToastAction, SIGNUP_ERROR,
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
	pinError: string;

	loginForm: FormGroup;
	signupForm: FormGroup;

	user$: Observable<User>;

	loginModalActions = new EventEmitter<string|MaterializeAction>();
	signupModalActions = new EventEmitter<string|MaterializeAction>();
	pinModalActions = new EventEmitter<string|MaterializeAction>();

	@ViewChildren('pinInput') pinInput;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private fb: FormBuilder
	) {
		this.showLoginModal$ = this.store.select(showLoginSelector).skip(1);
		this.showSignupModal$ = this.store.select(showSignupSelector).skip(1);
		this.showPinModal$ = this.store.select(showPinSelector).skip(1);

		this.loginForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.signupForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
			first_name: ['', Validators.required],
			last_name: ['', Validators.required],
			confirm_password: ['', Validators.required]
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
				this.pinInput.first.nativeElement.focus();
			}
		);

		this.store.select(pinSetSelector).subscribe(val => {
			if (val) {
				this.pinModalActions.emit({action: 'modal', params: ['close']});
			}
		});

		this.loginErrors$ = this.store.select(loginErrorsSelector);
		this.signupErrors$ = this.store.select(signupErrorsSelector);

		this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));

	}

	formErrors = {
		'email': '',
		'first_name': '',
		'last_name': '',
		'password': ''
	};

	validationMessages = {
		'email': {
			'required': 'Email is required'
		},
		'first_name': {
			'required': 'First name is required'
		},
		'last_name': {
			'required': 'Last name is required'
		},
		'password': {
			'required': 'Password is required'
		}
	};

	onValueChanged(data?: any) {
		if (!this.signupForm) { return; }
		const form = this.signupForm;

		for (const field in this.formErrors) {
			// clear previous error messages
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}

	// TODO: find a better place to do a router.navigate instead of subscribing to the user here

	login() {
		this.store.dispatch(new ClearErrorAction(LOGIN_ERROR));
		this.store.dispatch(new SignInEmailAction({
			email: this.loginForm.value.email,
			password: this.loginForm.value.password
		}));
		this.user$ = this.store.select(userSelector);
		this.user$.take(2).subscribe(
			user => {
				if (user) {
					this.loginModalActions.emit({action: 'modal', params: ['close']});
					this.loginForm.reset();
					this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Login Successful!']));
					this.router.navigate(['/', 'home', 'notes']);
				}
			}
		);
	}

	loginWithGoogle() {
		this.store.dispatch(new SignInGoogleAction());
		this.user$ = this.store.select(userSelector);
		this.user$.take(2).subscribe(
			user => {
				if (user) {
					this.loginModalActions.emit({action: 'modal', params: ['close']});
					this.loginForm.reset();
					this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Login Successful!']));
					this.router.navigate(['/', 'home', 'notes']);
				}
			}
		);
	}

	signup() {
		this.store.dispatch(new ClearErrorAction(SIGNUP_ERROR));

		if (!this.signupForm.valid) {
			this.store.dispatch(new ErrorOccurredAction({
				type: SIGNUP_ERROR,
				message: 'Invalid form'
			}));
		} else {

			this.store.dispatch(new SignupAction({
				email: this.signupForm.value.email,
				password: this.signupForm.value.password,
				first_name: this.signupForm.value.first_name,
				last_name: this.signupForm.value.last_name
			}));
			this.store.select(userSelector).take(2).subscribe(
				user => {
					if (user) {
						this.signupModalActions.emit({action: 'modal', params: ['close']});
						this.signupForm.reset();
						this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Signup Successful!']));
						this.router.navigate(['/', 'home', 'notes']);
					}
				}
			);
		}
	}

	setPin(pin: string) {
		if (pin.length > 0) {
			this.store.dispatch(new SetPinAction(pin));
			this.pinModalActions.emit({action: 'modal', params: ['close']});
		} else {
			this.pinError = 'Pin must be longer than 0 characters';
		}
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
