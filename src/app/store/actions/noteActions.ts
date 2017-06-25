import {Action} from "@ngrx/store";
import {Note} from "../../shared/models/note";
import {CreateNoteModel} from "../../shared/models/createNote";

export const LOAD_INITIAL_NOTES_ACTION = 'LOAD_INITIAL_NOTES_ACTION';
export const LOAD_SINGLE_NOTE_ACTION = 'LOAD_SINGLE_NOTE_ACTION';
export const NOTES_LOADED_ACTION = 'NOTES_LOADED_ACTION';
export const SINGLE_NOTE_LOADED_ACTION = 'SINGLE_NOTE_LOADED_ACTION';
export const GET_NOTE_KEYS_ACTION = 'GET_NOTE_KEY_ACTION';
export const NOTE_KEYS_LOADED_ACTION = 'NOTE_KEYS_LOADED_ACTION';
export const CREATE_NOTE_ACTION = 'CREATE_NOTE_ACTION';
export const UPDATE_NOTE_ACTION = 'UPDATE_NOTE_ACTION';
export const DELETE_NOTE_ACTION = 'DELETE_NOTE_ACTION';
export const LOAD_NEXT_NOTES_ACTION = 'LOAD_NEXT_NOTES_ACTION';
export const LOAD_PREV_NOTES_ACTION = 'LOAD_PREV_NOTES_ACTION';

export class LoadInitialNotesAction implements Action {
	type = LOAD_INITIAL_NOTES_ACTION;
	constructor(public payload?: {userKey: string, sortBy: string}) { }
}

export interface LoadSingleNotePayload {
	userKey: string;
	noteKey: string;
}
export class LoadSingleNoteAction implements Action {
	type = LOAD_SINGLE_NOTE_ACTION;
	constructor(public payload?: LoadSingleNotePayload) { }
}
export class SingleNoteLoadedAction implements Action {
	type = SINGLE_NOTE_LOADED_ACTION;
	constructor(public payload?: Note) { }
}


// This tells the notes reducer that new notes have been loaded.
// Accepts an array of notes as the payload
export class NotesLoadedAction implements Action {
	type = NOTES_LOADED_ACTION;
	constructor(public payload?: any) { }
}

// Gets the website names of all the notes
export class LoadNoteKeysAction implements Action {
	type = GET_NOTE_KEYS_ACTION;
	constructor(public payload?: string) { }
}

export class NoteKeysLoadedAction implements Action {
	type = NOTE_KEYS_LOADED_ACTION;
	constructor(public payload?: any) { }
}

// Called when an note is to be created
// Accepts an note object and a user key as payload
export interface CreateNotePayload {
	noteData: CreateNoteModel;
	userKey: string;
}
export class CreateNoteAction implements Action {
	type = CREATE_NOTE_ACTION;
	constructor(public payload?: CreateNotePayload) { }
}

// Called when an note is to be updated
// Accepts an note object, a user key, and an note key as payload
export interface UpdateNotePayload {
	noteData: CreateNoteModel;
	userKey: string;
	noteKey: string;
}
export class UpdateNoteAction implements Action {
	type = UPDATE_NOTE_ACTION;
	constructor(public payload?: UpdateNotePayload) { }
}

// Called when an note is to be deleted
// Accepts the user key and note key as the payload
export interface DeleteNotePayload {
	noteKey: string;
	userKey: string;
}
export class DeleteNoteAction implements Action {
	type = DELETE_NOTE_ACTION;
	constructor(public payload?: DeleteNotePayload) { }
}

export interface PaginateNotesPayload {
	userKey: string;
	currentNoteKey: string;
}
export class LoadNextNotesAction implements Action {
	type = LOAD_NEXT_NOTES_ACTION;
	constructor(public payload?: PaginateNotesPayload) { }
}
export class LoadPrevNotesAction implements Action {
	type = LOAD_PREV_NOTES_ACTION;
	constructor(public payload?: PaginateNotesPayload) { }
}


