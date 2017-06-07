import {Routes} from "@angular/router";
import {LandingComponent} from "./landing/landing.component";
import {Error404Component} from "./error404component/error404component.component";
export const routes: Routes = [

	{
		path: '',
		component: LandingComponent,
		pathMatch: 'full'
	},
	{
		path: '**',
		component: Error404Component
	}

];
