import { Component} from '@angular/core';
import {Model} from '../model'

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})
export class ModelFormComponent  {
  Model = new Model('','','','',[],'',[]);
  

  UploadForm(){
    let Model = {};


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
