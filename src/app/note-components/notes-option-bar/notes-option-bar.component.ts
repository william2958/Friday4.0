import {
	ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {ORDER_BY_NEWEST, ORDER_BY_OLDEST} from "../../services/account.service";
import {LoadInitialNotesAction, LoadNextNotesAction, LoadPrevNotesAction} from "../../store/actions/noteActions";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import * as _ from 'lodash';
import {Note} from "../../shared/models/note";

@Component({
	selector: 'notes-option-bar',
	templateUrl: './notes-option-bar.html',
	styleUrls: ['./notes-option-bar.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesOptionBarComponent implements OnInit {

	@Input() notes: Note[];
	@Input() sortBy;
	@Input() noteKeys: any[];
	@Input() userKey;
	@Output() updateSort = new EventEmitter();

	constructor(
		private store: Store<ApplicationState>
	) { }

	ngOnInit() {
	}

	changeSort(event: any) {
		// Emit the change in ordering
		if (event === 'oldest') {
			this.updateSort.emit(ORDER_BY_OLDEST);
		} else {
			this.updateSort.emit(ORDER_BY_NEWEST);
		}
		// Fetch another set of notes
		this.store.dispatch(new LoadInitialNotesAction({
			userKey: this.userKey,
			sortBy: this.sortBy
		}));
	}

	prevPage() {
		if (this.sortBy === ORDER_BY_NEWEST) {
			if (_.last(this.notes).key === _.last(this.noteKeys).key) {
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

}
