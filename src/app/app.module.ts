import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {AuthEffectService} from "./store/effects/auth-effect.service";
import {EffectsModule} from "@ngrx/effects";
import { NavComponent } from './nav/nav.component';
import { ModalsComponent } from './shared/modal/modals/modals.component';
import { HomeComponent } from './home/home.component';
import {AuthGuard} from "./shared/guards/auth.guard";
import {ToastService} from "./services/toast.service";
import {GlobalEffectService} from "./store/effects/global-effect.service";
import {QuicknoteService} from "./services/quicknote.service";
import {QuicknoteEffectService} from "./store/effects/quicknote-effect.service";
import { AccountsComponent } from './account-components/accounts/accounts.component';
import { NotesComponent } from './note-components/notes/notes.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import {MaterializeModule} from "angular2-materialize";
import {AccountEffectService} from "./store/effects/account-effect.service";
import {AccountService} from "./services/account.service";
import { AccountComponent } from './account-components/account/account.component';
import { NewAccountComponent } from './account-components/new-account/new-account.component';
import {LoggedOutGuard} from "./shared/guards/logged-out.guard";
import { AccountDetailComponent } from './account-components/account-detail/account-detail.component';
import {EncryptService} from "./services/encrypt.service";
import {NoteService} from "./services/note.service";
import { NoteComponent } from './note-components/note/note.component';
import {NoteEffectService} from "./store/effects/note-effect.service";
import { NewNoteComponent } from './note-components/notes-new/notes-new.component';
import { NoteDetailComponent } from './note-components/note-detail/note-detail.component';
import { QuicknotesComponent } from './quicknote-components/quicknotes/quicknotes.component';
import { QuicknoteComponent } from './quicknote-components/quicknote/quicknote.component';

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
		Error404Component,
		NavComponent,
		ModalsComponent,
		HomeComponent,
		AccountsComponent,
		NotesComponent,
		SideNavComponent,
		AccountComponent,
		NewAccountComponent,
		AccountDetailComponent,
		NoteComponent,
		NewNoteComponent,
		NoteDetailComponent,
		QuicknotesComponent,
		QuicknoteComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		MaterializeModule,
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
		EffectsModule.run(AuthEffectService),
		EffectsModule.run(GlobalEffectService),
		EffectsModule.run(QuicknoteEffectService),
		EffectsModule.run(AccountEffectService),
		EffectsModule.run(NoteEffectService)
	],
	providers: [
		AuthService,
		AuthEffectService,
		AuthGuard,
		LoggedOutGuard,
		ToastService,
		QuicknoteService,
		AccountEffectService,
		AccountService,
		EncryptService,
		NoteService,
		NoteEffectService
	],
	bootstrap: [FridayComponent]
})
export class AppModule {

}
