import {Routes} from "@angular/router";
import {LandingComponent} from "./landing/landing.component";
import {Error404Component} from "./error404component/error404component.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {NotesComponent} from "./notes/notes.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {NewAccountComponent} from "./new-account/new-account.component";
import {LoggedOutGuard} from "./shared/guards/logged-out.guard";
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
				path: 'newAccount',
				component: NewAccountComponent
			},
			{
				path: 'accounts',
				component: AccountsComponent
			},
			{
				path: 'notes',
				component: NotesComponent
			}
		]
	},
	{
		path: '**',
		component: Error404Component
	}

];
