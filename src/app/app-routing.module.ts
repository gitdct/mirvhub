import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsLibraryComponent } from './components/assets-library/assets-library.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { AddNewResourceViewComponent } from './components/add-new-resource-view/add-new-resource-view.component';
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component';
import { ModelFormComponent } from './components/model-form/model-form.component';
import { AssetbundleFormComponent } from './components/assetbundle-form/assetbundle-form.component';
import { SolicitorFormComponent } from './components/solicitor-form/solicitor-form.component';
import { SubjectFormComponent } from './components/subject-form/subject-form.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { TagFormComponent } from './components/tag-form/tag-form.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { EditionFormComponent } from './components/edition-form/edition-form.component';
import { UpdateFileFormComponent } from './components/update-file-form/update-file-form.component';

import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: '', component: HomeComponentComponent},
  {path: 'library', component: AssetsLibraryComponent },
  {path: 'side', component: SideMenuComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'documentation', component: DocumentationComponent},
  {path: 'upload', component: AddNewResourceViewComponent, canActivate: [AuthGuardService] },
  {path: 'upload/asset', component: ModelFormComponent, canActivate: [AuthGuardService], children: [{path: 'solicitor-form', component: SolicitorFormComponent, outlet: 'auxiliar', children: [{path: 'subject-form', component: SubjectFormComponent, outlet: 'auxiliar2'}, {path: 'role-form', component: RoleFormComponent, outlet: 'auxiliar2'}]}, {path: 'tag-form', component: TagFormComponent, outlet: 'auxiliar'}]},
  {path: 'upload/assetbundle', component: AssetbundleFormComponent, canActivate: [AuthGuardService], children: [{path: 'solicitor-form', component: SolicitorFormComponent, outlet: 'auxiliar', children: [{path: 'subject-form', component: SubjectFormComponent, outlet: 'auxiliar2'}, {path: 'role-form', component: RoleFormComponent, outlet: 'auxiliar2'}]}, {path: 'tag-form', component: TagFormComponent, outlet: 'auxiliar'}]},
  {path: 'edit/information/:id', component: EditionFormComponent, canActivate: [AuthGuardService], children: [{path: 'solicitor-form', component: SolicitorFormComponent, outlet: 'auxiliar', children: [{path: 'subject-form', component: SubjectFormComponent, outlet: 'auxiliar2'}, {path: 'role-form', component: RoleFormComponent, outlet: 'auxiliar2'}]}, {path: 'tag-form', component: TagFormComponent, outlet: 'auxiliar'}]},
  {path: 'edit/upload/files/:type/:id', component: UpdateFileFormComponent, canActivate: [AuthGuardService]},
  {path: 'visualizer', component: ModelViewerComponent},
  {path: '**', component: HomeComponentComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
