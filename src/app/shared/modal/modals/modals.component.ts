import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {showGuardedLoginSelector, showLoginSelector, showSignupSelector} from "./show-selectors";
import {ApplicationState} from "../../../store/application-state";
import {Store} from "@ngrx/store";
import {SignInEmailAction, SignupAction} from "../../../store/actions/authActions";
import {userSelector} from "../../../nav/user-selector";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
	ClearErrorAction, LOGIN_ERROR, ShowToastAction, SIGNUP_ERROR,
	SUCCESS_TOAST
} from "../../../store/actions/globalActions";
import {User} from "../../models/user";
import {MaterializeAction} from "angular2-materialize";
declare const jQuery: any;

@Component({
	selector: 'modals',
	templateUrl: './modals.component.html',
	styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

	@ViewChild('loginModal') loginEl: ElementRef;
	@ViewChild('signupModal') signupEl: ElementRef;
	@ViewChild('guardedLoginModal') guardedLoginEl: ElementRef;

	showLoginModal$: Observable<boolean>;
	showGuardedLoginModal$: Observable<boolean>;
	showSignupModal$: Observable<boolean>;

	loginForm: FormGroup;
	signupForm: FormGroup;

	user$: Observable<User>;

	loginModalActions = new EventEmitter<string|MaterializeAction>();
	signupModalActions = new EventEmitter<string|MaterializeAction>();

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router,
	    private fb: FormBuilder
	) {
		this.showLoginModal$ = this.store.select(showLoginSelector).skip(1);
		this.showGuardedLoginModal$ = this.store.select(showGuardedLoginSelector).skip(1);
		this.showSignupModal$ = this.store.select(showSignupSelector).skip(1);

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
				// jQuery(this.loginEl.nativeElement).modal('hide');
				// jQuery(this.loginEl.nativeElement).modal('show');
				this.loginModalActions.emit({action: 'modal', params: ['open']});
			}
		);

		this.showGuardedLoginModal$.subscribe(
			() => {
				jQuery(this.guardedLoginEl.nativeElement).modal('hide');
				jQuery(this.guardedLoginEl.nativeElement).modal('show');
			}
		);

		this.showSignupModal$.subscribe(
			() => {
				// jQuery(this.signupEl.nativeElement).modal('hide');
				// jQuery(this.signupEl.nativeElement).modal('show');
				this.signupModalActions.emit({action: 'modal', params: ['open']});
			}
		);

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
					// jQuery(this.loginEl.nativeElement).modal('hide');
					this.loginModalActions.emit({action: 'modal', params: ['close']});
					this.loginForm.reset();
					this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Login Successful!']));
					this.router.navigate(['home', 'accounts']);
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

					// jQuery(this.signupEl.nativeElement).modal('hide');
					this.signupModalActions.emit({action: 'modal', params: ['close']});
					this.signupForm.reset();
					this.store.dispatch(new ShowToastAction([SUCCESS_TOAST, 'Signup Successful!']));
					this.router.navigate(['home', 'accounts']);
				}
			}
		);
	}

	close() {
		this.loginModalActions.emit({action: 'modal', params: ['close']});
		// jQuery(this.guardedLoginEl.nativeElement).modal('hide');
		this.signupModalActions.emit({action: 'modal', params: ['close']});
	}

}
