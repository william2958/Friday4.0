import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {Router} from "@angular/router";

@Component({
	selector: 'notes-search',
	templateUrl: './notes-search.component.html',
	styleUrls: ['./notes-search.component.css']
})
export class NotesSearchComponent implements OnInit {

	@Input() noteKeys: any[];
	@Input() userKey: string;

	hoveredResult;
	// String of results to display from searching
	searchResults: string[] = [];

	constructor(
		private router: Router
	) { }

	ngOnInit() {
	}

	// Close the search results
	closeSearch() {
		this.searchResults = [];
	}

	// This gets called every time a user enters a key into the search box
	search(searchTerms: string) {
		if (searchTerms !== '') {
			this.searchResults = _.filter(this.noteKeys, (val) => {
				return val.value.toLowerCase().indexOf(searchTerms.toLowerCase()) !== -1;
			});
		} else {
			this.searchResults = [];
		}
	}

	showDetail(result) {
		this.router.navigate(['/', 'home', 'notes', result.key, this.userKey]);
	}

	// Change the hovered item
	changeSearchBackground($event) {
		this.hoveredResult = $event;
	}

}
