import {Component, Input, OnInit} from '@angular/core';
import {Account} from "../shared/models/account";

@Component({
	selector: 'account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

	@Input() account: Account;

	constructor() { }

	ngOnInit() {
	}

}
