import { Component,ViewChild} from '@angular/core';
import {Model} from '../model';
import {ClrWizard} from '@clr/angular';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})

export class ModelFormComponent  {
  Model = new Model('','','','',[],'',[]);
  
  lgOpen: boolean = false;

  openForm(){
    this.lgOpen = true;
  }

  @ViewChild("wizardlg") wizardLarge: ClrWizard;

  UploadForm(){
    console.log('working!');
  }

  isHovering: boolean;
  files: File[] = [];

  toggleHover(event: boolean){
   this.isHovering = event; 
  }

  onDrop(files: FileList){
    for (let i = 0; i< files.length; i++){
      this.files.push(files.item(i)); 
    }
  }

}
