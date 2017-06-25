import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {User} from "../../shared/models/user";
import {Subscription} from "rxjs/Subscription";
import {NOTES_PAGE_SIZE} from "../../services/note.service";
import {Note} from "../../shared/models/note";
import {userSelector} from "../../nav/user-selector";
import {mapStateToCurrentNoteKeySelector, mapStateToNoteKeysSelector, mapStateToNotesSelector} from "./noteSelectors";
import {
	LoadInitialNotesAction, LoadNextNotesAction, LoadNoteKeysAction,
	LoadPrevNotesAction
} from "../../store/actions/noteActions";
import {ORDER_BY_NEWEST} from "../../services/account.service";
import * as _ from 'lodash';

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
	notes: Note[] = [];
	viewNotes: Note[];

	currentNoteKey$: Observable<string>;

	noteKeys$: Observable<any[]>;
	noteKeys: any[];

	// Subscriptions
	userSubscription$: Subscription;
	notesSubscription$: Subscription;
	noteKeysSubscription$: Subscription;

	// String of results to display from searching
	searchResults: string[] = [];

	// How to sort the notes (newest, oldest)
	sortBy: string = ORDER_BY_NEWEST;

	numPages: any[];
	hoveredResult;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router
	) { }

	ngOnInit() {

		// Set up the initial subscriptions
		this.user$ = this.store.select(userSelector);
		this.currentNoteKey$ = this.store.select(mapStateToCurrentNoteKeySelector);
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

		this.noteKeysSubscription$ = this.noteKeys$.subscribe(
			keys => {
				this.noteKeys = _.cloneDeep(keys);
				const numberOfPages: number = Math.ceil(this.noteKeys.length / NOTES_PAGE_SIZE);
				this.numPages = Array(numberOfPages).fill(0).map((x, i) => i + 1);
			}
		);

		this.notesSubscription$ = this.notes$.subscribe(
			notes => {
				if (notes.length > 0) {
					// First make a deep copy of the notes
					this.notes = _.cloneDeep(notes);
					console.log('retrieved notes: ', this.notes);

					// Sort the notes
					if (this.notes.length > 0) {
						if (this.sortBy === ORDER_BY_NEWEST) {
							// If we need to flip the notes
							this.viewNotes = _.cloneDeep(this.notes);
							this.viewNotes = _.reverse(this.viewNotes);
						} else {
							// If the notes are good as is
							this.viewNotes = _.cloneDeep(this.notes);
						}
					}
				}
			}
		);

	}

	addNote() {
		this.router.navigate(['/', 'home', 'notes', 'new']);
	}

	goToNote(key: string) {
		this.router.navigate(['/', 'home', 'notes', key, this.userKey]);
	}

	// Close the search results
	closeSearch() {
		this.searchResults = [];
	}

	// This gets called every time a user enters a key into the search box
	search(searchTerms: string) {
		if (searchTerms !== '') {
			this.searchResults = _.filter(this.noteKeys, (val) => {
				return val.value.indexOf(searchTerms) !== -1;
			});
		} else {
			this.searchResults = [];
		}
	}

	// Change the hovered item
	changeSearchBackground($event) {
		this.hoveredResult = $event;
	}

	showDetail(result) {
		this.router.navigate(['/', 'home', 'notes', result.key, this.userKey]);
	}

	prevPage() {
		if (this.sortBy === ORDER_BY_NEWEST) {
			if (_.last(this.notes).key === _.last(this.noteKeys).key) {
				console.log('cannot go backwards another page.');
			} else {
				if (this.notes.length > 0) {
					this.store.dispatch(new LoadNextNotesAction({
						userKey: this.userKey,
						// Pass in the last key of the shown notes
						currentNoteKey: _.last(this.notes).key
					}));
				}
			}
		} else {
			if (this.notes[0].key === this.noteKeys[0].key) {
				console.log('cannot go back another page.');
			} else {
				if (this.notes.length > 0) {
					this.store.dispatch(new LoadPrevNotesAction({
						userKey: this.userKey,
						// Pass in the last key of the shown notes
						currentNoteKey: this.notes[0].key
					}));
				}
			}
		}
	}

	nextPage() {

		if (this.sortBy === ORDER_BY_NEWEST) {
			// If we're sorting by newest the this.notes array has already been flipped
			if (this.notes[0].key === this.noteKeys[0].key) {
				console.log('cannot go forwards another page.');
			} else {
				if (this.notes.length > 0) {
					this.store.dispatch(new LoadPrevNotesAction({
						userKey: this.userKey,
						// Pass in the last key of the shown notes
						currentNoteKey: this.notes[0].key
					}));
				}
			}
		} else {
			if (_.last(this.notes).key === _.last(this.noteKeys).key) {
				console.log('cannot go forward another page.');
			} else {
				if (this.notes.length > 0) {
					this.store.dispatch(new LoadNextNotesAction({
						userKey: this.userKey,
						// Pass in the last key of the shown notes
						currentNoteKey: _.last(this.notes).key
					}));
				}
			}
		}
	}

	ngOnDestroy() {
		this.userSubscription$.unsubscribe();
		this.notesSubscription$.unsubscribe();
		this.noteKeysSubscription$.unsubscribe();
	}

}
