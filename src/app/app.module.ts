import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ModelFormComponent } from './components/model-form/model-form.component';
import { ModelListComponent } from './components/model-list/model-list.component';
import { ModelUploadComponent } from './components/model-upload/model-upload.component';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component';
import { UserSignupComponent } from './components/user-signup/user-signup.component';
import { UserLoginComponent } from './components/user-login/user-login.component';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { FirebaseMethodsService } from './services/firebase-methods.service';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { AssetsLibraryComponent } from './components/assets-library/assets-library.component';
import { AssetCardComponent } from './components/asset-card/asset-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainContainerComponent,
    TopBarComponent,
    ModelFormComponent,
    ModelListComponent,
    ModelUploadComponent,
    HomeComponentComponent,
    ModelViewerComponent,
    UserSignupComponent,
    UserLoginComponent,
    ModalMessageComponent,
    AssetsLibraryComponent,
    AssetCardComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule
  ],
  providers: [
    FirebaseMethodsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
