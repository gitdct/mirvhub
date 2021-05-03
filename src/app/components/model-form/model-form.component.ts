import { Component, ViewChild, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClrWizard } from '@clr/angular';
import { Asset } from '../../models/Asset';
import { ActivatedRoute, Router } from '@angular/router';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})

export class ModelFormComponent implements OnInit, OnDestroy {

  public sessionDataSubscription: Subscription;

  public solicitors: any[];
  public solicitorsSubscription: Subscription;
  
  public assets: any[];
  public assetsSubscription: Subscription;

  public roles: any[];
  public rolesSubscription: Subscription;
  
  public subjects: any[];
  public subjectsSubscription: Subscription;

  public tags: any[];
  public tagsSubscription: Subscription;
  
  public tagsSelected: any[];

  public solicitorForm;
  public newSolicitor: boolean = true;
  
  public readyToUpload: boolean = false;

  public editionMode: boolean = false;

  private assetFromEdit;

  constructor(
    private fbMS: FirebaseMethodsService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public RoleTypes = [];
  public newRegistry: Asset;

  public fileGlb: File = null;
  public fileFbx: File = null;
  public fileObj: File = null;

  public fileImage: File = null;
  
  public fileImageTarget: File = null;

  public messageTitle: string = null;
  public messageText: string = null;
  
  public accept() {}

  @ViewChild("wizardlg") wizardLarge: ClrWizard;
  
  ngOnInit() {
    this.assetsSubscription = this.fbMS.assets.subscribe(data => {
      this.assets = [...data];
    });
    this.solicitorsSubscription = this.fbMS.solicitors.subscribe(data => {
      this.solicitors = [...data];
    });
    this.rolesSubscription = this.fbMS.roles.subscribe(data => {
      this.roles = [...data];
    });
    this.subjectsSubscription = this.fbMS.subjects.subscribe(data => {
      this.subjects = [...data];
    });
    this.tagsSubscription = this.fbMS.tags.subscribe(data => {
      this.tags = [...data];
    });
    this.solicitorForm = {
      name: null,
      email: null,
      subject: null,
      role: null,
    };
    this.newRegistry = {
      name: '',
      description: null,
      createdat: null,
      createdby: null,
      solicitor: null,
      tags: [],
      files: {fbx: [], glb: [], obj: [], andab: [], iosab: []},
      target: false,
      assetbundle: false,
      imgext: null
    }
    this.fileGlb = null;
    this.fileFbx = null;
    this.fileObj = null;
    this.sessionDataSubscription = this.fbMS.sessionData.subscribe(
      sessionData => {
        this.ngZone.run(() => {
          this.newRegistry.createdby = sessionData.name;
        });
      }
    );
    this.tagsSelected = [];
    this.openForm();
  }

  public fileDangerMessage: number = -1;
  public fileMessages: string[] = [
    'Algun archivo que desea subir tiene extensión duplicada, solamente puede subir un archivo por extensión (.glb, .fbx, .obj)',
    'Algun archivo que desea subir no esta permitido. Verifique bien los archivos que esta subiendo.',
    'El tipo de archivo que desea subir no esta permitido. Solo se permiten formatos jpg o png.',
    'Solamente puede subir una imagen de previsualización por registro.',
    'Registro ya existente, verifique bien la información que esta por subir',
    'Algun archivo que desea subir puede estar repetido con los que se han subido previamente. Revise bien que los archivos que desea subir son nuevos y de ser asi puede dar clic nuevamente en Finalizar.'
  ];
  
  lgOpen: boolean = false;

  openForm()
  {
    this.lgOpen = true;
  }

  async uploadForm()
  {
    let date = new Date().getTime();
    this.newRegistry.createdat = date;
    if(this.newRegistry.files.glb.length > 0){
      this.newRegistry.files.glb[0]['uploadedAt'] = date;
    }
    if(this.newRegistry.files.fbx.length > 0){
      this.newRegistry.files.fbx[0]['uploadedAt'] = date;
    }
    if(this.newRegistry.files.obj.length > 0){
      this.newRegistry.files.obj[0]['uploadedAt'] = date;
    }
    this.fbMS.uploadAssetData(this.newRegistry).then((id) => {
      let promiseArray = [];
      if(this.fileGlb != null){
        promiseArray.push(this.fbMS.uploadAssetFile(`assets/glb/${id}.glb`, this.fileGlb));
      }
      if(this.fileFbx != null){
        promiseArray.push(this.fbMS.uploadAssetFile(`assets/fbx/${id}.fbx`, this.fileFbx));
      }
      if(this.fileObj != null){
        promiseArray.push(this.fbMS.uploadAssetFile(`assets/obj/${id}.obj`, this.fileObj));
      }
      promiseArray.push(this.fbMS.uploadAssetFile(`img/${id}.${this.newRegistry.imgext}`, this.fileImage));
      Promise.all(promiseArray).then(() => {
        this.endForm();
      });
    });
  }

  async validBeforeSubmit() {
    this.readyToUpload = await new Promise(resolve => {
      let glb = null;
      let fbx = null;
      let obj = null;
      let sameSize = false;
      this.fbMS.existsValidation(this.newRegistry).then(response => {
        if(response){
          this.fileDangerMessage = 4;
          setTimeout(() => {
            this.fileDangerMessage = -1;
          },5000);
          resolve(false);
        }else{
          console.log(this.fileGlb);
          if(this.assets.length > 0){
            for(let i = 0; i < this.assets.length; i++){
              if(this.fileGlb != null){
                if(typeof(this.assets[i].files.glb) !== 'undefined'){
                  for(let j = 0; j < this.assets[i].files.glb.length; j++){
                    if(this.assets[i].files.glb[j].size == this.fileGlb.size){
                      sameSize = true;
                    }
                  }
                }
              }
              if(this.fileFbx != null){
                if(typeof(this.assets[i].files.fbx) !== 'undefined'){
                  for(let j = 0; j < this.assets[i].files.fbx.length; j++){
                    if(this.assets[i].files.fbx[j].size == this.fileFbx.size){
                      sameSize = true;
                    }
                  }
                }
              }
              if(this.fileObj != null){
                if(typeof(this.assets[i].files.obj) !== 'undefined'){
                  for(let j = 0; j < this.assets[i].files.obj.length; j++){
                    if(this.assets[i].files.obj[j].size == this.fileObj.size){
                      sameSize = true;
                    }
                  }
                }
              }
            }
          }
          if(sameSize){
            this.fileDangerMessage = 5;
            setTimeout(() => {
              this.fileDangerMessage = -1;
            },5000);
          }
          resolve(true);
        }
      });
    });
  }
  
  endForm(){
    this.messageText = 'Tu informacion ha sido enviada exitosamente';
    this.accept = () => {
      this.messageText = null;
      this.router.navigateByUrl('/upload');
    }
  }

  cancelForm()
  {
    this.ngOnInit();
    this.wizardLarge.reset();
    this.router.navigateByUrl('/upload');
  }

  selectSolicitor(solicitorsubject, solicitorrole, solicitor) {
    this.newRegistry.solicitor = solicitor.id;
    this.solicitorForm = solicitor;
    solicitorsubject.value = this.subjects[this.subjects.findIndex(({id}) => id == solicitor.subject)].value;
    solicitorrole.value = this.roles[this.roles.findIndex(({id}) => id == solicitor.role)].value;
  }
    
  onDropNewAssetFile(event) {
    let formatNotAccepted = false;
    let formatRepeated = false;
    let glbPresent = false;
    let fbxPresent = false;
    let objPresent = false;
    let glbDirection = 0;
    let fbxDirection = 0;
    let objDirection = 0;
    for(let i=0; i<event.addedFiles.length; i++){
      let fileProps = event.addedFiles[i].name.split('.');
      if(fileProps.length == 2){
        if(fileProps[1].toUpperCase() != 'glb'.toUpperCase() && fileProps[1].toUpperCase() != 'fbx'.toUpperCase() && fileProps[1].toUpperCase() != 'obj'.toUpperCase()){
          formatNotAccepted = true;
          return;
        }
        if(fileProps[1].toUpperCase() == 'glb'.toUpperCase() && this.fileGlb == null){
          glbPresent = true;
          glbDirection = i;
        }else if(fileProps[1].toUpperCase() == 'glb'.toUpperCase() && this.fileGlb != null){
          formatRepeated = true;
        }
        if(fileProps[1].toUpperCase() == 'fbx'.toUpperCase() && this.fileFbx == null){
          fbxPresent = true;
          fbxDirection = i;
        }else if(fileProps[1].toUpperCase() == 'fbx'.toUpperCase() && this.fileFbx != null){
          formatRepeated = true;
        }
        if(fileProps[1].toUpperCase() == 'obj'.toUpperCase() && this.fileObj == null){
          objPresent = true;
          objDirection = i;
        }else if(fileProps[1].toUpperCase() == 'obj'.toUpperCase() && this.fileObj != null){
          formatRepeated = true;
        }
      }else{
        formatNotAccepted = true;
        return;
      }
    }
    if(formatNotAccepted){
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
    if(formatRepeated){
      this.fileDangerMessage = 0;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
    if(glbPresent){
      this.newRegistry.files.glb.push({type: 'glb', size: event.addedFiles[glbDirection].size, uploadedBy: this.newRegistry.createdby});
      this.fileGlb = event.addedFiles[glbDirection];
    }
    if(fbxPresent){
      this.newRegistry.files.fbx.push({type: 'fbx', size: event.addedFiles[fbxDirection].size, uploadedBy: this.newRegistry.createdby});
      this.fileFbx = event.addedFiles[fbxDirection];
    }
    if(objPresent){
      this.newRegistry.files.obj.push({type: 'obj', size: event.addedFiles[objDirection].size, uploadedBy: this.newRegistry.createdby});
      this.fileObj = event.addedFiles[objDirection];
    }
  }
  
  onRemoveAssetFile(ext) {
    if(ext == 'glb'){
      this.fileGlb = null;
      this.newRegistry.files.glb = [];
    }
    if(ext == 'fbx'){
      this.fileFbx = null;
      this.newRegistry.files.fbx = [];
    }
    if(ext == 'obj'){
      this.fileObj = null;
      this.newRegistry.files.obj = [];
    }
  }

  onDropImage(event) {
    let fileProps = event.addedFiles[0].name.split('.');
    if(this.fileImage != null){
      this.fileDangerMessage = 3;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
    if(fileProps.length == 2){
      if(fileProps[1].toUpperCase() == 'jpg'.toUpperCase() || fileProps[1].toUpperCase() == 'png'.toUpperCase()){
        this.fileImage = event.addedFiles[0];
        this.newRegistry.imgext = fileProps[1].toLowerCase();
        return;
      }else{
        this.fileDangerMessage = 2;
        setTimeout(() => {
          this.fileDangerMessage = -1;
        },5000);
        return;
      }
    }else{
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
  }
  
  onRemoveImage() {
    this.fileImage = null;
    this.newRegistry.imgext = null;
  }

  onTagSelect(id, event) {
    if(event.target.classList.contains('label-light-blue')){
      this.tagsSelected.push(id);
      this.newRegistry.tags.push(id);
    }else{
      this.tagsSelected.splice(this.tagsSelected.indexOf(id), 1);
      this.newRegistry.tags.splice(this.newRegistry.tags.indexOf(id), 1);
    }
  }

  getTagName(idtag) {
    return this.tags[this.tags.findIndex(({id}) => id == idtag)].tag;
  }

  ngOnDestroy() {
    this.sessionDataSubscription.unsubscribe();
    this.solicitorsSubscription.unsubscribe();
    this.rolesSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }

}
