import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.css']
})
export class ModelUploadComponent implements OnInit {

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;


  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit() {
    this.startUpload();

  }

  startUpload(){
    const modelpath = `Models/${Date.now()}_${this.file.name}`;

    const ref = this.storage.ref(modelpath);

    this.task = this.storage.upload(modelpath, this.file);

    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),

      finalize( async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.db.collection('files').add({downloadURL: this.downloadURL, modelpath});
      }),
    );
  }

  isActive(snapshot){
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }


}
