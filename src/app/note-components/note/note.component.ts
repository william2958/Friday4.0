import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from "../../shared/models/note";

@Component({
	selector: 'note',
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

	@Input() note: Note;
	@Output() editNote = new EventEmitter();
	@Output() deleteNote = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	// If we want to just view the note
	goToNote() {
		this.editNote.emit({key: this.note.key, edit: false});
	}

	// If we want to directly edit the note
	goToEditNote() {
		this.editNote.emit({key: this.note.key, edit: true});
	}

	deleteThisNote() {
		this.deleteNote.emit(this.note.key);
	}

}
