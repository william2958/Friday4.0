import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Quicknote} from "../../shared/models/quicknote";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";

@Component({
	selector: 'quicknote',
	templateUrl: './quicknote.component.html',
	styleUrls: ['./quicknote.component.css']
})
export class QuicknoteComponent implements OnInit {

	@Input() quicknote: Quicknote;
	@Output() deleteQuicknote = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	deleteNote() {
		this.deleteQuicknote.emit(this.quicknote.key);
	}

}
