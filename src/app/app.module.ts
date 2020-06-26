import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ModelFormComponent } from './model-form/model-form.component';
import { ModelListComponent } from './model-list/model-list.component';
import { DropzoneDirective } from './dropzone.directive';
import { ModelUploadComponent } from './model-upload/model-upload.component';
import { environment } from 'src/environments/environment';
import { HomeComponentComponent } from './home-component/home-component.component';
import { ModelViewerComponent } from './model-viewer/model-viewer.component';


@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainContainerComponent,
    TopBarComponent,
    ModelFormComponent,
    ModelListComponent,
    DropzoneDirective,
    ModelUploadComponent,
    HomeComponentComponent,
    ModelViewerComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
