import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	/*
	Login Modal component will redirect to /notes
	So will the logged-out guard
	 */

	sidenavActions = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {
	}

	shownav() {
		this.sidenavActions.emit({action: "sideNav", params: ['show']});
		console.log('showing nav');
	}

}
