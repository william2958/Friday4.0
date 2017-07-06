import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";
import {CreateQuicknoteAction} from "../store/actions/quicknoteActions";
import {Observable} from "rxjs/Observable";
import {ClearErrorAction, QUICKNOTE_ERROR} from "../store/actions/globalActions";

@Component({
	selector: 'landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	quicknoteForm: FormGroup;

	errors$: Observable<string[]>;

	constructor(
		private store: Store<ApplicationState>,
	    private fb: FormBuilder
	) {

		this.quicknoteForm = this.fb.group({
			email: ['', Validators.required],
			body: ['', Validators.required]
		});

		this.errors$ = store.select(quicknoteErrorSelector);

	}

	ngOnInit() {

	}

	createQuicknote() {
		this.store.dispatch(new ClearErrorAction(QUICKNOTE_ERROR));
		this.store.dispatch(new CreateQuicknoteAction({
			email: this.quicknoteForm.value.email,
			body: this.quicknoteForm.value.body
		}));
		this.quicknoteForm.reset();
	}

}

function quicknoteErrorSelector(state: ApplicationState): string[] {

	return state.uiState.errors[QUICKNOTE_ERROR];

}
