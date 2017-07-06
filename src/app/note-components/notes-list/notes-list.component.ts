import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import {DeleteNoteAction} from "../../store/actions/noteActions";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

@Component({
	selector: 'notes-list',
	templateUrl: './notes-list.component.html',
	styleUrls: ['./notes-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesListComponent implements OnInit, OnChanges {

	@Input() notes;
	@Input() reverse;
	@Input() userKey: string;

	constructor(
		private store: Store<ApplicationState>,
	    private router: Router
	) { }

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {

		if (changes['notes']) {
			// We will receive a new notes array every time the sort
			// is updated
			if (this.reverse) {
				this.notes = _.reverse(_.cloneDeep(this.notes));
			}
		}

	}

	// This receives a payload containing the key of the note as well as
	// the a boolean that specifies if editing is necessary.
	goToNote(payload: any) {
		this.router.navigate(['/', 'home', 'notes', payload.key, this.userKey],
			{queryParams: {edit: payload.edit}});
	}

	deleteNote(key: string) {
		this.store.dispatch(new DeleteNoteAction({
			noteKey: key,
			userKey: this.userKey
		}));
	}

}
