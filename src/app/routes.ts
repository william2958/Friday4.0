import {Routes} from "@angular/router";
import {LandingComponent} from "./landing/landing.component";
import {Error404Component} from "./error404component/error404component.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {NotesComponent} from "./note-components/notes/notes.component";
import {AccountsComponent} from "./account-components/accounts/accounts.component";
import {NewAccountComponent} from "./account-components/new-account/new-account.component";
import {LoggedOutGuard} from "./shared/guards/logged-out.guard";
import {AccountDetailComponent} from "./account-components/account-detail/account-detail.component";
import {NewNoteComponent} from "./note-components/notes-new/notes-new.component";
import {NoteDetailComponent} from "./note-components/note-detail/note-detail.component";
import {QuicknotesComponent} from "./quicknote-components/quicknotes/quicknotes.component";
import {PinGuard} from "./shared/guards/pin.guard";
export const routes: Routes = [

	{
		path: '',
		component: LandingComponent,
		pathMatch: 'full',
		canActivate: [LoggedOutGuard]
	},
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'accounts',
				children: [
					{
						path: 'new',
						component: NewAccountComponent
					},
					{
						path: ':accountId/:userId',
						component: AccountDetailComponent
					},
					{
						path: '',
						component: AccountsComponent,
					}
				]
			},
			{
				path: 'notes',
				children: [
					{
						path: 'new',
						component: NewNoteComponent
					},
					{
						path: ':noteId/:userId',
						component: NoteDetailComponent
					},
					{
						path: '',
						component: NotesComponent
					}
				]
			},
			{
				path: 'quicknotes',
				component: QuicknotesComponent
			}
		]
	},
	{
		path: '**',
		component: Error404Component
	}

];
