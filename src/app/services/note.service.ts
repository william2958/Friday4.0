import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {ORDER_BY_NEWEST, ORDER_BY_OLDEST} from "./account.service";
import {CreateNoteModel} from "../shared/models/createNote";
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import * as firebase from 'firebase';

export const NOTES_PAGE_SIZE = 12;

@Injectable()
export class NoteService {

	constructor(
		private db: AngularFireDatabase
	) { }

	getInitialNotes(userKey: string, orderBy: string = ORDER_BY_NEWEST) {
		// Load the first page of notes

		let firstPageNoteKeys$ = undefined;

		// Get the notes keys observable
		if (orderBy === ORDER_BY_NEWEST) {
			firstPageNoteKeys$ = this.findNoteKeys(userKey, {
				query: {
					limitToLast: NOTES_PAGE_SIZE
				}
			});
		} else if (orderBy === ORDER_BY_OLDEST) {
			firstPageNoteKeys$ = this.findNoteKeys(userKey, {
				query: {
					limitToFirst: NOTES_PAGE_SIZE
				}
			});
		}

		// Once we have the account keys we go find the accounts associated to them.
		return this.findNotesForNoteKeys(firstPageNoteKeys$);

	}

	// Accepts the user key and the currently shown last account key
	loadNextPage(userKey: string, currentNoteKey: string) {

		const nextPageKeys$ = this.findNoteKeys(userKey, {
			query: {
				orderByKey: true,
				startAt: currentNoteKey,
				limitToFirst: NOTES_PAGE_SIZE + 1
			}
		});

		return this.findNotesForNoteKeys(nextPageKeys$)
		// Remove the first one because that one is the last one currently
		// being shown
			.map(notes => notes.slice(1, notes.length));
	}

	loadPrevPage(userKey: string, currentNoteKey: string) {

		const prevPageKeys$ = this.findNoteKeys(userKey, {
			query: {
				orderByKey: true,
				endAt: currentNoteKey,
				limitToLast: NOTES_PAGE_SIZE + 1
			}
		});

		return this.findNotesForNoteKeys(prevPageKeys$)
		// Remove the last note returned because that is the last one
		// currently being shown
			.map(notes => notes.slice(0,  notes.length - 1));
	}

	loadSingleNote(noteKey: string) {
		return this.db.object('notes/' + noteKey)
			.map(note => {
				note.key = note.$key;
				return note;
			});
	}

	getNoteKeys(userKey: string) {

		// Returns object map of key and value of all the accountsPerUser
		// for the userKey user
		return this.db.list('notesPerUser/' + userKey)
			.map(notePerUser => {
				// This value that is passed in is the array of objects
				// So we must map through each element in that array to get it's key
				// and value and return it.
				// The value is the title of the note
				return notePerUser.map(noteKey => {
					return {
						key: noteKey.$key,
						value: noteKey.$value
					};
				});
			});
	}




	// CRUD


	createNote(noteData: CreateNoteModel, userKey: string) {
		const notesToSave = Object.assign({}, noteData, {userKey});
		const newNoteKey = this.db.database.ref().child('notes').push().key;
		const dataToSave = {};

		dataToSave['notes/' + newNoteKey] = {
			title: notesToSave.title,
			body: notesToSave.body,
			// firebase timestamp ensures accurate time sync with firebase
			date_created: firebase.database.ServerValue.TIMESTAMP
		};
		dataToSave['notesPerUser/' + userKey + '/' + newNoteKey] = notesToSave.title;

		return this.firebaseUpdate(dataToSave);
	}

	updateNote(noteData: CreateNoteModel, userKey: string, noteKey: string) {
		const dataToSave = {};

		dataToSave['note'] = {
			title: noteData.title,
			body: noteData.body
		};

		dataToSave['noteKey'] = noteKey;

		dataToSave['userKey'] = userKey;

		return this.firebaseUpdateNote(dataToSave);
	}

	deleteNote(userKey: string, noteKey: string) {

		const dataToSave = {};

		dataToSave['notes/' + noteKey] = null;
		dataToSave['notesPerUser/' + userKey + '/' + noteKey] = null;

		return this.firebaseUpdate(dataToSave);
	}




	// FIREBASE INTERACTION METHODS BELOW



	// Get the account keys from the accountsPerUser node. Goes off of
	// the userKey and a query object that can be used for pagination
	findNoteKeys(userKey: string, query: FirebaseListFactoryOpts = {}): Observable<string[]> {
		return this.db.list('notesPerUser/' + userKey, query)
		// This list command will return an array of Objects. Each object
		// represents the key and value of the accountsPerUser data. Eg:
		// {$value: 'spotify', $key: '-KmTA00WL2..'}
			.map(notePerUser => {
				// This value that is passed in is the array of objects
				// So we must map through each element in that array to get it's $key and return it.
				return notePerUser.map(note => note.$key);
			});
	}

	// Find the array of accounts for a specific array of account keys
	findNotesForNoteKeys(noteKeys$: Observable<string[]>): Observable<Account[]> {
		return noteKeys$
			.map(notes => {
				// This is the array of keys
				return notes.map(noteKey => {
					// Run through each account key and return the object
					// of the account in the accounts node
					return this.db.object('notes/' + noteKey);
				});
			})
			.flatMap(firebaseObjectObservables => Observable.combineLatest(firebaseObjectObservables));
	}

	firebaseUpdate(dataToSave) {

		const subject = new Subject();

		this.db.database.ref().update(dataToSave)
			.then(
				val => {
					subject.next(val);
					subject.complete();
				},
				err => {
					subject.error(err);
					subject.complete();
				}
			);

		return subject.asObservable();

	}

	firebaseUpdateNote(dataToSave) {

		const subject = new Subject();

		this.db.database.ref('notes').child(dataToSave['noteKey'])
			.update(dataToSave['note'])
			.then(
				val => {
					subject.next(val);
					subject.complete();
				},
				err => {
					subject.error(err);
					subject.complete();
				}
			);

		this.db.database.ref('notesPerUser' + '/' + dataToSave.userKey + '/' + dataToSave.noteKey)
			.set(dataToSave.note.title);

		return subject.asObservable();

	}


}
