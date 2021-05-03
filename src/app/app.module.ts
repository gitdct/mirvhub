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
import { CdsModule } from '@cds/angular';

import { FirebaseMethodsService } from './services/firebase-methods.service';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { AssetsLibraryComponent } from './components/assets-library/assets-library.component';
import { SubjectFormComponent } from './components/subject-form/subject-form.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { TagFormComponent } from './components/tag-form/tag-form.component';
import { AddNewResourceViewComponent } from './components/add-new-resource-view/add-new-resource-view.component';
import { AssetbundleFormComponent } from './components/assetbundle-form/assetbundle-form.component';
import { SolicitorFormComponent } from './components/solicitor-form/solicitor-form.component';
import { AssetNavDetailsComponent } from './components/asset-nav-details/asset-nav-details.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { EditionFormComponent } from './components/edition-form/edition-form.component';
import { UpdateFileFormComponent } from './components/update-file-form/update-file-form.component';

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
    SubjectFormComponent,
    RoleFormComponent,
    TagFormComponent,
    AddNewResourceViewComponent,
    AssetbundleFormComponent,
    SolicitorFormComponent,
    AssetNavDetailsComponent,
    ProjectsComponent,
    DocumentationComponent,
    EditionFormComponent,
    UpdateFileFormComponent
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
    CdsModule,
    HttpClientModule
  ],
  providers: [
    FirebaseMethodsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
