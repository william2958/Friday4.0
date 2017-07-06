import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
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
import {MaterializeAction} from "angular2-materialize";

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

	quicknoteForm: FormGroup;

	deleteAllActions = new EventEmitter<string|MaterializeAction>();

	constructor(
		private store: Store<ApplicationState>,
	    private fb: FormBuilder
	) {
		this.quicknoteForm = this.fb.group({
			body: ['', Validators.required]
		});
	}

	ngOnInit() {

		this.user$ = this.store.select(userSelector);
		this.quicknotes$ = this.store.select(mapStateToQuicknotesSelector);

		this.userSubscription$ = this.user$.subscribe(
			user => {
				if (user) {
					this.user = _.cloneDeep(user);
					this.store.dispatch(new LoadQuicknotesAction(this.user.uid));
				}
			}
		);

	}

	deleteQuicknote(quicknoteKey: string) {
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

	showDeleteAllModal() {
		this.deleteAllActions.emit({action: 'modal', params: ['open']});
	}

	deleteAll() {
		if (this.user) {
			this.store.dispatch(new DeleteAllQuicknotesAction(this.user.uid));
		}
	}

	ngOnDestroy() {

		this.userSubscription$.unsubscribe();

	}

}
