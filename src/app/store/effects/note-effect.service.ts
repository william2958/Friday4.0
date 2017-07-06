import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {NoteService} from "../../services/note.service";
import {ApplicationState} from "../application-state";
import {Store} from "@ngrx/store";
import {
	CREATE_NOTE_ACTION, DELETE_NOTE_ACTION,
	GET_NOTE_KEYS_ACTION,
	LOAD_INITIAL_NOTES_ACTION, LOAD_NEXT_NOTES_ACTION, LOAD_PREV_NOTES_ACTION, LOAD_SINGLE_NOTE_ACTION,
	NoteKeysLoadedAction,
	NotesLoadedAction, SingleNoteLoadedAction, UPDATE_NOTE_ACTION
} from "../actions/noteActions";
import {Observable} from "rxjs/Observable";
import {ErrorOccurredAction, NOTE_ERROR, ShowToastAction, SUCCESS_TOAST} from "../actions/globalActions";

@Injectable()
export class NoteEffectService {

	constructor(
		private actions$: Actions,
	    private noteService: NoteService,
	    private store: Store<ApplicationState>
	) { }

	// This effect will actually get triggered by firebase updates
	// because this.noteService.getNotes will actually return
	// an observable that can be updated. Every time the firebase
	// database is updated, by create or update, the NotesLoadedAction
	// will be updated.

	@Effect() getInitialNotes$ = this.actions$
		.ofType(LOAD_INITIAL_NOTES_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.getInitialNotes(action.payload.userKey, action.payload.sortBy)
			).catch(
				(err) => {
					if (err.code !== 'PERMISSION_DENIED') {
						this.store.dispatch(new ErrorOccurredAction({
							type: NOTE_ERROR,
							message: err.message
						}));
					}
					return Observable.empty();
				}
			)
		)
		.map(notes => new NotesLoadedAction(notes));

	@Effect() getNextNotes$ = this.actions$
		.ofType(LOAD_NEXT_NOTES_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.loadNextPage(action.payload.userKey, action.payload.currentNoteKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: NOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(notes => new NotesLoadedAction(notes));

	@Effect() getPrevNotes$ = this.actions$
		.ofType(LOAD_PREV_NOTES_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.loadPrevPage(action.payload.userKey, action.payload.currentNoteKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: NOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(notes => new NotesLoadedAction(notes));

	@Effect() getSingleNote$ = this.actions$
		.ofType(LOAD_SINGLE_NOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.loadSingleNote(action.payload.noteKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: NOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		)
		.map(note => new SingleNoteLoadedAction(note));

	// This effect will actually get triggered by firebase updates
	// because this.noteService.getNotes will actually return
	// an observable that can be updated. Every time the firebase
	// database is updated, by create or update, the NotesLoadedAction
	// will be updated.
	@Effect() getNoteKeys$ = this.actions$
		.ofType(GET_NOTE_KEYS_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.getNoteKeys(action.payload)
			).catch(
				(err) => {
					if (err.code !== 'PERMISSION_DENIED') {
						this.store.dispatch(new ErrorOccurredAction({
							type: NOTE_ERROR,
							message: err.message
						}));
					}
					return Observable.empty();
				}
			)
		).map(noteKeys => new NoteKeysLoadedAction(noteKeys));

	@Effect() createNote$ = this.actions$
		.ofType(CREATE_NOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.createNote(action.payload.noteData, action.payload.userKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: NOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Note Created!']));


	@Effect() updateNote$ = this.actions$
		.ofType(UPDATE_NOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.updateNote(action.payload.noteData, action.payload.userKey, action.payload.noteKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: NOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Note Updated!']));

	@Effect() deleteNote$ = this.actions$
		.ofType(DELETE_NOTE_ACTION)
		.switchMap(action => Observable
			.from(
				this.noteService.deleteNote(action.payload.userKey, action.payload.noteKey)
			).catch(
				(err) => {
					this.store.dispatch(new ErrorOccurredAction({
						type: NOTE_ERROR,
						message: err.message
					}));
					return Observable.empty();
				}
			)
		).map(res => new ShowToastAction([SUCCESS_TOAST, 'Note Deleted!']));


}
