import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HomeComponentComponent } from './components/home-component/home-component.component'
import { ModelFormComponent } from './components/model-form/model-form.component'
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component'



const routes: Routes = [
  {path: '', component: HomeComponentComponent},
  {path: 'library', component: MainContainerComponent },
  {path: 'side', component: SideMenuComponent},
  {path: 'upload', component: ModelFormComponent },
  {path: 'visualizer', component: ModelViewerComponent},
  {path: '**', component: HomeComponentComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
