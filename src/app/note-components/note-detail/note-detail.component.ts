import {Component, OnDestroy, OnInit} from '@angular/core';
import {mapStateToNotesSelector} from "../notes/noteSelectors";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {Note} from "../../shared/models/note";
import {DeleteNoteAction, LoadSingleNoteAction, UpdateNoteAction} from "../../store/actions/noteActions";
import {mapStateToSingleNoteSelector} from "./mapStateToSingleNoteSelector";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'note-detail',
	templateUrl: './note-detail.component.html',
	styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit, OnDestroy {

	noteId: string;
	userId: string;
	note: Note;
	notes$: Observable<Note[]>;
	notesSubscription$: Subscription;
	formatedBody: string[];

	editNoteForm: FormGroup;
	editMode: boolean;

	constructor(
		private store: Store<ApplicationState>,
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder
	) { }

	ngOnInit() {

		this.noteId = this.route.snapshot.params['noteId'];
		this.userId = this.route.snapshot.params['userId'];
		this.notes$ = this.store.select(mapStateToNotesSelector);

		this.editNoteForm = this.fb.group({
			title: [''],
			body: ['']
		});

		this.route
			.queryParams
			.first()
			.subscribe(params => {
				// Defaults to 0 if no query param provided.
				this.editMode = (params['edit'] === 'true');
			});

		// Take notes from the notes available in the store
		this.notesSubscription$ = this.notes$.take(2).subscribe(
			notes => {

				// This checks if the note was navigated to from the
				// notes page (meaning that the note is already stored
				// in the store)
				for (const note of notes) {
					if (note.key === this.noteId) {
						this.note = _.cloneDeep(note);
						this.setForm();
					}
				}

				// If the note still has not been found and needs to be
				// retrieved from the backend
				if (!this.note) {
					this.store.dispatch(new LoadSingleNoteAction({
						userKey: this.userId,
						noteKey: this.noteId
					}));
					this.store.select(mapStateToSingleNoteSelector).take(2).subscribe(
						note => {
							if (note) {
								this.note = _.cloneDeep(note);
								this.setForm();
							}
						}
					).unsubscribe();
				}

				// Now let's format the string
				if (this.note) {
					this.formatedBody = this.note.body.split('\n');
				}

			}
		);

	}

	setForm() {
		this.editNoteForm.setValue({
			title: this.note.title,
			body: this.note.body
		});
	}

	editNote(edit: boolean) {
		this.router.navigate(['/', 'home', 'notes', this.note.key, this.userId],
			{queryParams: {edit: edit}});
		this.editMode = edit === true;
	}

	saveNote() {
		if (
			this.note.title === this.editNoteForm.value.title &&
			this.note.body === this.editNoteForm.value.body
		) {
		} else {
			this.store.dispatch(new UpdateNoteAction({
				userKey: this.userId,
				noteData: {
					title: this.editNoteForm.value.title,
					body: this.editNoteForm.value.body
				},
				noteKey: this.note.key
			}));
		}
	}

	deleteNote() {
		this.store.dispatch(new DeleteNoteAction({
			noteKey: this.note.key,
			userKey: this.userId
		}));
		this.router.navigate(['/', 'home', 'notes']);
	}

	ngOnDestroy() {
		this.notesSubscription$.unsubscribe();
	}

}
