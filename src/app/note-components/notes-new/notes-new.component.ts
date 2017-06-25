import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Router} from "@angular/router";
import {userKeySelector} from "../../store/selectors/user-key-selector";
import {CreateNoteAction} from "../../store/actions/noteActions";

@Component({
	selector: 'notes-new',
	templateUrl: './notes-new.component.html',
	styleUrls: ['./notes-new.component.css']
})
export class NewNoteComponent implements OnInit, OnDestroy {

	createNoteForm: FormGroup;
	userKey$: Observable<string>;
	userKeySubscription$: Subscription;
	userKey: string;

	constructor(
		private store: Store<ApplicationState>,
		private router: Router,
		private fb: FormBuilder
	) {
		this.createNoteForm = this.fb.group({
			title: ['', Validators.required],
			body: ['']
		});
	}

	ngOnInit() {
		this.userKey$ = this.store.select(userKeySelector);
		this.userKeySubscription$ = this.userKey$.subscribe(
			key => this.userKey = key
		);
	}

	createNote() {
		this.store.dispatch(new CreateNoteAction({
			noteData: {
				title: this.createNoteForm.value.title,
				body: this.createNoteForm.value.body
			},
			userKey: this.userKey
		}));
		this.back();
	}

	back() {
		this.router.navigate(['', 'home', 'notes']);
	}

	ngOnDestroy() {
		this.userKeySubscription$.unsubscribe();
	}

}
