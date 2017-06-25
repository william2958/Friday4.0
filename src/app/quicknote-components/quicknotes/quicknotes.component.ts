import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {
	CreateQuicknoteAction,
	DeleteAllQuicknotesAction, DeleteQuicknoteAction,
	LoadQuicknotesAction
} from "../../store/actions/quicknoteActions";
import {User} from "../../shared/models/user";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash';
import {userSelector} from "../../nav/user-selector";
import {Quicknote} from "../../shared/models/quicknote";
import {mapStateToQuicknotesSelector} from "./quicknoteSelectors";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
	selector: 'quicknotes',
	templateUrl: './quicknotes.component.html',
	styleUrls: ['./quicknotes.component.css']
})
export class QuicknotesComponent implements OnInit, OnDestroy {

	user$: Observable<User>;
	userSubscription$: Subscription;
	user: User;

	quicknotes$: Observable<Quicknote[]>;
	quicknotesSubscription$: Subscription;

	quicknoteForm: FormGroup;

	constructor(
		private store: Store<ApplicationState>,
	    private fb: FormBuilder
	) {
		this.quicknoteForm = this.fb.group({
			body: ['body', Validators.required]
		});
	}

	ngOnInit() {

		this.user$ = this.store.select(userSelector);
		this.quicknotes$ = this.store.select(mapStateToQuicknotesSelector);

		this.userSubscription$ = this.user$.subscribe(
			user => {
				if (user) {
					this.user = _.cloneDeep(user);
					console.log('getting quicknotes...');
					this.store.dispatch(new LoadQuicknotesAction(this.user.uid));
				}
			}
		);

		this.quicknotesSubscription$ = this.quicknotes$.subscribe(
			quicknotes => {
				console.log('quicknotes recieved in component: ', quicknotes);
			}
		);
	}

	deleteQuicknote(quicknoteKey: string) {
		console.log('deleting single quicknote:', quicknoteKey);
		if (this.user) {
			this.store.dispatch(new DeleteQuicknoteAction({
				userKey: this.user.uid,
				quicknoteKey: quicknoteKey
			}));
		}
	}

	createQuicknote() {
		if (this.user) {
			this.store.dispatch(new CreateQuicknoteAction({
				email: this.user.email,
				body: this.quicknoteForm.value.body
			}));
		}
	}

	deleteAll() {
		if (this.user) {
			this.store.dispatch(new DeleteAllQuicknotesAction(this.user.uid));
		}
	}

	ngOnDestroy() {

		this.userSubscription$.unsubscribe();
		this.quicknotesSubscription$.unsubscribe();

	}

}
