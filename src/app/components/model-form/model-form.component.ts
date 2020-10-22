import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ClrWizard } from '@clr/angular';
import { Asset, ResourceType } from '../../models/Asset';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})

export class ModelFormComponent  {

  constructor(private firebaseMethodsService: FirebaseMethodsService) { }

  keys = Object.keys;
  resourcetype = ResourceType;

  @Input() assetbundlefile: File;
  @Input() fbxarrayfile: FileList;

  
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  public newRegistry: Asset = {
    name: '',
    desc: '',
    restype: ResourceType[0],
    createdat: new Date(),
    updatedat: [],
    solicitor: null,
    createdby: '',
    updatedby: '',
    tags: []
  }
  
  lgOpen: boolean = false;

  openForm()
  {
    this.lgOpen = true;
  }

  @ViewChild("wizardlg") wizardLarge: ClrWizard;

  uploadForm()
  {
    this.firebaseMethodsService.uploadAssetData(this.newRegistry);
  }

  isHovering: boolean;
  files: File[] = [];

  toggleHover(event: boolean)
  {
   this.isHovering = event; 
  }

  assetbundleUpload(files: FileList)
  {
    this.assetbundlefile = files[0];
  }

  onDrop(files: FileList)
  {
    /* this.assetbundlefile = files; */
  }

  startUploadAssetBundle(id: string)
  {
    
    /* this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.firestore.collection('assets').add({downloadURL: this.downloadURL, modelpath});
      }),
    ); */
  }








  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);

    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file[]", this.files[i]);
    }

    /* this.http.post('http://localhost:8001/upload.php', formData)
    .subscribe(res => {
       console.log(res);
       alert('Uploaded Successfully.');
    }) */
}

onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
}

}
