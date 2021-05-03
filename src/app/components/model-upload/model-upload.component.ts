import { Component, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.css']
})
export class ModelUploadComponent {

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;


  constructor(private firestorage: AngularFireStorage, private firestore: AngularFirestore) { }

  /* ngOnInit() {
    this.startUpload();
  } */

  startUpload(){
    const modelpath = `AssetBundles/${Date.now()}_${this.file.name}`;
    const ref = this.firestorage.ref(modelpath);
    this.task = this.firestorage.upload(modelpath, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.firestore.collection('files').add({downloadURL: this.downloadURL, modelpath});
      }),
    );
  }

  isActive(snapshot){
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
