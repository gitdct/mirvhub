import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainContainerComponent} from './main-container/main-container.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {ModelUploadComponent} from './model-upload/model-upload.component';
import {HomeComponentComponent} from './home-component/home-component.component'
import {ModelFormComponent} from './model-form/model-form.component'

const routes: Routes = [
  {path: 'library', component: MainContainerComponent },
  {path: 'side', component: SideMenuComponent},
  {path: 'upload', component: ModelFormComponent },
  {path: '**', component: HomeComponentComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
