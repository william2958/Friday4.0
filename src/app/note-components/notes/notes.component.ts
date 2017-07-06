import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs/Observable";
import {User} from "../../shared/models/user";
import {Subscription} from "rxjs/Subscription";
import {Note} from "../../shared/models/note";
import {userSelector} from "../../nav/user-selector";
import {mapStateToNoteKeysSelector, mapStateToNotesSelector} from "./noteSelectors";
import {
	LoadInitialNotesAction, LoadNoteKeysAction
} from "../../store/actions/noteActions";
import {ORDER_BY_NEWEST} from "../../services/account.service";

@Component({
	selector: 'notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {

	user$: Observable<User>;
	userKey = '';

	// Subscription is so that we can unsubscribe to notes$ when
	// we leave the page, viewNotes is for the component to load
	// notes in the view and notes is for next page prev page
	notes$: Observable<Note[]>;

	noteKeys$: Observable<any[]>;

	// Subscriptions
	userSubscription$: Subscription;

	// How to sort the notes (newest, oldest)
	sortBy: string = ORDER_BY_NEWEST;

	constructor(
		private store: Store<ApplicationState>
	) { }

	ngOnInit() {

		// Set up the initial subscriptions
		this.user$ = this.store.select(userSelector);
		this.noteKeys$ = this.store.select(mapStateToNoteKeysSelector);
		this.notes$ = this.store.select(mapStateToNotesSelector);

		// Get the user object so we can use the uid for all note actions
		this.userSubscription$ = this.user$.subscribe(
			user => {
				if (user) {
					this.userKey = user.uid;
					this.notes$.subscribe(
						notes => {
							if (notes.length === 0) {
								// Load new notes and keys when we don't have an notes array yet
								this.store.dispatch(new LoadNoteKeysAction(this.userKey));
								this.store.dispatch(new LoadInitialNotesAction({
									userKey: this.userKey,
									sortBy: this.sortBy
								}));
							}
						}
					).unsubscribe();
				}
			}
		);

	}

	updateSort(event: any) {
		// This will be emitted by the option bar
		this.sortBy = event;
	}

	ngOnDestroy() {
		this.userSubscription$.unsubscribe();
	}

}
