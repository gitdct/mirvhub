import { Component, ViewChild, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClrWizard } from '@clr/angular';
import { Asset } from '../../models/Asset';
import { Router } from '@angular/router';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';


@Component({
  selector: 'app-assetbundle-form',
  templateUrl: './assetbundle-form.component.html',
  styleUrls: ['./assetbundle-form.component.css']
})
export class AssetbundleFormComponent implements OnInit, OnDestroy {

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

  constructor(
    private fbMS: FirebaseMethodsService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  public RoleTypes = [];
  public newRegistry: Asset;

  public fileAndroid: File = null;
  public fileIos: File = null;

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
      files: {andab: [], iosab: []},
      target: false,
      assetbundle: true,
      imgext: null,
      tarext: null
    }
    this.fileAndroid = null;
    this.fileIos = null;
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
    'Solamente puede subir un archivo. Asegurese que sea el assetbundle que demanda la sección.',
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
    if(this.newRegistry.files.andab.length > 0){
      this.newRegistry.files.andab[0]['uploadedAt'] = date;
    }
    if(this.newRegistry.files.iosab.length > 0){
      this.newRegistry.files.iosab[0]['uploadedAt'] = date;
    }
    this.fbMS.uploadAssetData(this.newRegistry).then((id) => {
      let promiseArray = [];
      promiseArray.push(this.fbMS.uploadAssetFile(`assetbundle/android/${id}`, this.fileAndroid));
      promiseArray.push(this.fbMS.uploadAssetFile(`assetbundle/ios/${id}`, this.fileIos));
      if(this.fileImageTarget != null){
        promiseArray.push(this.fbMS.uploadAssetFile(`targets/${id}.${this.newRegistry.tarext}`, this.fileImageTarget));
      }
      promiseArray.push(this.fbMS.uploadAssetFile(`img/${id}.${this.newRegistry.imgext}`, this.fileImage));
      Promise.all(promiseArray).then(() => {
        this.endForm();
      });
    });
  }

  async validBeforeSubmit() {
    this.readyToUpload = await new Promise(resolve => {
      let sameSize = false;
      this.fbMS.existsValidation(this.newRegistry).then(response => {
        if(response){
          this.fileDangerMessage = 5;
          setTimeout(() => {
            this.fileDangerMessage = -1;
          },5000);
          resolve(false);
        }else{
          if(this.assets.length > 0){
            for(let i = 0; i < this.assets.length; i++){
              if(typeof(this.assets[i].files.andab) !== 'undefined'){
                for(let j = 0; j < this.assets[i].files.andab.length; j++){
                  if(this.assets[i].files.andab[j].size == this.fileAndroid.size){
                    sameSize = true;
                  }
                }
              }
              if(typeof(this.assets[i].files.iosab) !== 'undefined'){
                for(let j = 0; j < this.assets[i].files.iosab.length; j++){
                  if(this.assets[i].files.iosab[j].size == this.fileIos.size){
                    sameSize = true;
                  }
                }
              }
            }
          }
          if(sameSize){
            this.fileDangerMessage = 6;
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
    
  onDropNewAndroidAssetbundleFile(event) {
    let assetbundlePresent = false;
    let formatNotAccepted = false;
    if(this.fileAndroid != null || event.addedFiles.length > 1){
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }else{
      let fileProps = event.addedFiles[0].name.split('.');
      if(fileProps.length == 1){
        assetbundlePresent = true;
      }else{
        formatNotAccepted = true;
      }

    }
    if(formatNotAccepted){
      this.fileDangerMessage = 2;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
    if(assetbundlePresent){
      this.newRegistry.files.andab.push({type: 'andab', size: event.addedFiles[0].size, uploadedBy: this.newRegistry.createdby});
    }
    this.fileAndroid = event.addedFiles[0];
  }
  
  onRemoveAndroidAssetbundleFile() {
    this.fileAndroid = null;
    this.newRegistry.files.andab = [];
  }

  onDropNewIOSAssetbundleFile(event) {
    let assetbundlePresent = false;
    let formatNotAccepted = false;
    if(this.fileIos != null || event.addedFiles.length > 1){
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }else{
      let fileProps = event.addedFiles[0].name.split('.');
      if(fileProps.length == 1){
        assetbundlePresent = true;
      }else{
        formatNotAccepted = true;
      }

    }
    if(formatNotAccepted){
      this.fileDangerMessage = 2;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
    if(assetbundlePresent){
      this.newRegistry.files.iosab.push({type: 'iosab', size: event.addedFiles[0].size, uploadedBy: this.newRegistry.createdby});
    }
    this.fileIos = event.addedFiles[0];
  }
  
  onRemoveIOSAssetbundleFile() {
    this.fileIos = null;
    this.newRegistry.files.iosab = [];
  }

  onDropImage(event) {
    let fileProps = event.addedFiles[0].name.split('.');
    if(this.fileImage != null){
      this.fileDangerMessage = 4;
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
        this.fileDangerMessage = 3;
        setTimeout(() => {
          this.fileDangerMessage = -1;
        },5000);
        return;
      }
    }else{
      this.fileDangerMessage = 2;
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
  
  onAddTarget(event) {
    let fileProps = event.addedFiles[0].name.split('.');
    if(this.fileImageTarget != null){
      this.fileDangerMessage = 4;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
    if(fileProps.length == 2){
      if(fileProps[1].toUpperCase() == 'jpg'.toUpperCase() || fileProps[1].toUpperCase() == 'png'.toUpperCase()){
        this.newRegistry.target = true;
        this.fileImageTarget = event.addedFiles[0];
        this.newRegistry.tarext = fileProps[1].toLowerCase();
        return;
      }else{
        this.fileDangerMessage = 3;
        setTimeout(() => {
          this.fileDangerMessage = -1;
        },5000);
        return;
      }
    }else{
      this.fileDangerMessage = 2;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      },5000);
      return;
    }
  }

  onRemoveTarget() {
    this.fileImageTarget = null;
    this.newRegistry.target = false;
    this.newRegistry.tarext = null;
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
