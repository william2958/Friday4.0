import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	sidenavActions = new EventEmitter<any>();
	// sidenavParams = [];

	constructor() { }

	ngOnInit() {
	}

	shownav() {
		this.sidenavActions.emit({action: "sideNav", params: ['show']});
		console.log('showing nav');
		// this.sidenavParams = ['show'];
		// this.sidenavActions.emit('sideNav');
	}

}
