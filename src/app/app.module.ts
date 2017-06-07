import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { FridayComponent } from './friday.component';
import {RouterModule} from "@angular/router";
import {routes} from "./routes";
import {Action, StoreModule} from "@ngrx/store";
import {uiState} from "./store/reducers/uiStateReducer";
import {accountData} from "./store/reducers/accountDataReducer";
import {noteData} from "./store/reducers/noteDataReducer";
import {quicknoteData} from "./store/reducers/quicknoteDataReducer";
import {routerReducer, RouterStoreModule} from "@ngrx/router-store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {ApplicationState, INITIAL_APPLICATION_STATE} from "./store/application-state";
import { LandingComponent } from './landing/landing.component';
import { Error404Component } from './error404component/error404component.component';
import {AngularFireModule} from "angularfire2";
import {firebaseConfig} from "../environments/firebase.config";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AuthService} from "./services/auth.service";
import {SignInEffectService} from "./store/effects/sign-in-effect.service";
import {EffectsModule} from "@ngrx/effects";

export function storeReducer(state: ApplicationState, action: Action): ApplicationState {
	return {
		uiState: uiState(state.uiState, action),
		accountData: accountData(state.accountData, action),
		noteData: noteData(state.noteData, action),
		quicknoteData: quicknoteData(state.quicknoteData, action),
		router: routerReducer(state.router, action)
	};
}

@NgModule({
	declarations: [
		FridayComponent,
		LandingComponent,
		Error404Component
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(routes),
		StoreModule.provideStore(
			storeReducer,
			INITIAL_APPLICATION_STATE
		),
		RouterStoreModule.connectRouter(),
		StoreDevtoolsModule.instrumentOnlyWithExtension(),
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		EffectsModule.run(SignInEffectService)
	],
	providers: [
		AuthService,
		SignInEffectService
	],
	bootstrap: [FridayComponent]
})
export class AppModule { }
