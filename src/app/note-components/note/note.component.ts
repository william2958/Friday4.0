import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../shared/models/note";

@Component({
	selector: 'note',
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

	@Input() note: Note;

	constructor() { }

	ngOnInit() {
	}

}
