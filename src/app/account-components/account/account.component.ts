import {
	ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {Account} from "../../shared/models/account";

@Component({
	selector: 'account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, OnChanges {

	@Input() account: Account;
	@Output() editAccount = new EventEmitter();
	@Output() deleteAccount = new EventEmitter();
	hiddenPassword = true;

	constructor(
	) { }

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
	}

	goToAccount() {
		this.editAccount.emit(this.account.key);
	}

	goToEditAccount() {
		this.editAccount.emit(this.account.key);
	}

	deleteThisAccount() {
		this.deleteAccount.emit(this.account.key);
	}

	showPassword() {
		this.hiddenPassword = !this.hiddenPassword;
	}

}
