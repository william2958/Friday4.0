import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import * as _ from 'lodash';

@Component({
	selector: 'accounts-search',
	templateUrl: './accounts-search.component.html',
	styleUrls: ['./accounts-search.component.css']
})
export class AccountsSearchComponent implements OnInit {

	@Input() accountKeys: any[];
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
			this.searchResults = _.filter(this.accountKeys, (val) => {
				return val.value.indexOf(searchTerms) !== -1;
			});
		} else {
			this.searchResults = [];
		}
	}

	showDetail(result) {
		this.router.navigate(['/', 'home', 'accounts', result.key, this.userKey]);
	}

	// Change the hovered item
	changeSearchBackground($event) {
		this.hoveredResult = $event;
	}

}
