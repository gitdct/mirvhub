import { Component, Input, ViewChild, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ClrWizard } from '@clr/angular';
import { Asset, Role } from '../../models/Asset';

import { FirebaseMethodsService, User } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})

export class ModelFormComponent implements OnInit {

  constructor(
    private firebaseMethodsService: FirebaseMethodsService,
    private ngZone: NgZone
  ) { }

  private Roles = Role;
  public RoleTypes = [];
  public newRegistry: Asset;

  sessionData: {active: false, abbreviatedName: null, name: null};

  public messageTitle: string = null;
  public messageText: string = null;
  
  public accept() {}

  llenarInfo()
  {
    this.newRegistry.name = 'Prueba';
    this.newRegistry.desc = 'Desc prueba';
    this.newRegistry.restype = null;
    this.newRegistry.createdat = new Date();
    this.newRegistry.updatedat = [];
    this.newRegistry.solicitor.name = 'Jonathan';
    this.newRegistry.solicitor.email = 'jona@piu.com';
    this.newRegistry.solicitor.subject = 'Ciencias';
    this.newRegistry.solicitor.role = this.RoleTypes[0];
  }

  @ViewChild("wizardlg") wizardLarge: ClrWizard;
  
  ngOnInit() {
    this.newRegistry = {
      name: '',
      desc: '',
      restype: null,
      createdat: new Date(),
      updatedat: [],
      solicitor: {
          name: null,
          email: null,
          subject: null,
          role: this.RoleTypes[0]
        },
      createdby: null,
      updatedby: '',
      tags: [],
      file: null,
      target: null
    }
    this.firebaseMethodsService.sessionIsActive().subscribe(
      sessionData => {
        this.ngZone.run(() => {
          this.newRegistry.createdby = sessionData.name;
        });
      }
    );
    this.RoleTypes = Object.keys(this.Roles);
  }

  keys = Object.keys;

  @Input() fbxarrayfile: FileList;

  
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  fileWarning: boolean = false;
  fileDanger: boolean = false;
  fileDangerTarget: boolean = false;

  
  lgOpen: boolean = false;

  openForm()
  {
    this.lgOpen = true;
  }

  uploadForm()
  {
    this.firebaseMethodsService.uploadAssetData(this.newRegistry).then((id) => {
      this.firebaseMethodsService.uploadAssetFile(`assets/${id}`, this.newRegistry.file).then(() => {
        if(this.newRegistry.restype == 'assetbundle'){
          this.firebaseMethodsService.uploadAssetFile(`targets/${id}.jpg`, this.newRegistry.target).then(() => {
            this.endForm();
          });
        }else{
          this.endForm();
        }
      });
    });
  }
  
  endForm(){
    this.cancelForm();
    this.messageText = 'Tu informacion ha sido enviada exitosamente';
    this.accept = () => {
      this.messageText = null;
    }
  }

  cancelForm()
  {
    this.ngOnInit();
    this.wizardLarge.reset();
  }

  isHovering: boolean;
  
  toggleHover(event: boolean)
  {
    this.isHovering = event; 
  }
  
  assetbundleUpload(files: FileList)
  {
    this.newRegistry.file = files[0];
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
    this.fileWarning = false;
    this.fileDanger = false;
    let fileProps = event.addedFiles[0].name.split('.');

    if(fileProps.length == 1){
      this.fileWarning = true;
      this.newRegistry.restype = 'assetbundle';
    }else if(fileProps.length == 2){
      if(fileProps[1] == 'fbx' || fileProps[1] == 'mat'){
        this.newRegistry.restype = fileProps[1];
      }else{
        this.fileDanger = true;
        return;
      }
    }else{
      this.fileDanger = true;
      return;
    }

    this.newRegistry.file = event.addedFiles[0];
  }

  onSelectTarget(event) {
    this.fileDangerTarget = false;
    let fileProps = event.addedFiles[0].name.split('.');

    if(fileProps.length == 1){
      this.fileDangerTarget = true;
    }else if(fileProps.length == 2){
      if(fileProps[1] == 'jpg'){
        this.newRegistry.target = event.addedFiles[0];
      }else{
        this.fileDangerTarget = true;
        return;
      }
    }else{
      this.fileDangerTarget = true;
      return;
    }
  }

  onRemove() {
    this.newRegistry.file = null;
  }

  onRemoveTarget() {
    this.newRegistry.target = null;
  }

}
