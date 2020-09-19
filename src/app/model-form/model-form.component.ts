import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ClrWizard } from '@clr/angular';
import Model from '../model';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})

export class ModelFormComponent  {

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage
  ) { }

  @Input() assetbundlefile: FileList;
  @Input() fbxarrayfile: FileList;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  public newRegistry: Model = {
    assetbundle: '',
    fbx: [],
    name: '',
    desc: '',
    subkey: '',
    category: '',
    group: ''
  }
  
  lgOpen: boolean = false;

  openForm()
  {
    this.lgOpen = true;
  }

  @ViewChild("wizardlg") wizardLarge: ClrWizard;

  UploadForm()
  {
    console.log('working!');
    return new Promise<any>((resolve, reject) => {
      this.firestore
          .collection('files')
          .add(this.newRegistry)
          .then((docRef) => {
            this.startUploadAssetBundle(docRef.id);
          }, err => reject(err));
    })
  }

  isHovering: boolean;
  files: File[] = [];

  toggleHover(event: boolean)
  {
   this.isHovering = event; 
  }

  assetbundleUpload(files: FileList)
  {
    this.assetbundlefile = files;
  }

  onDrop(files: FileList)
  {
    this.assetbundlefile = files;
  }

  startUploadAssetBundle(id: string)
  {
    const modelpath = `AssetBundles/${id}.fbx`;
    const ref = this.firestorage.ref(modelpath);
    this.task = this.firestorage.upload(modelpath, this.assetbundlefile);
    /* this.percentage = this.task.percentageChanges(); */
    /* this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.firestore.collection('files').add({downloadURL: this.downloadURL, modelpath});
      }),
    ); */
  }

}
