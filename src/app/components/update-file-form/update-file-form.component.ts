import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-update-file-form',
  templateUrl: './update-file-form.component.html',
  styleUrls: ['./update-file-form.component.css']
})
export class UpdateFileFormComponent implements OnInit, OnDestroy {

  public type: 'assetbundle' | 'asset' = null;
  private assets;

  private assetsSubscription: Subscription;

  public fileGlb: File = null;
  public fileFbx: File = null;
  public fileObj: File = null;
  public fileAndroid: File = null;
  public fileIos: File = null;

  public asset = {
    id: null,
    name: '',
    description: null,
    createdat: null,
    createdby: null,
    solicitor: null,
    tags: [],
    files: { fbx: [], glb: [], obj: [], andab: [], iosab: [] },
    target: false,
    assetbundle: false,
    imgext: null,
    imgURL: null
  }

  public fileMessages: string[] = [
    'Algun archivo que desea subir tiene extensión duplicada, solamente puede subir un archivo por extensión (.glb, .fbx, .obj)',
    'Algun archivo que desea subir no esta permitido. Verifique bien los archivos que esta subiendo.',
    'El tipo de archivo que desea subir no esta permitido. Solo se permiten formatos jpg o png.',
    'Solamente puede subir una imagen de previsualización por registro.',
    'Registro ya existente, verifique bien la información que esta por subir',
    'Algun archivo que desea subir puede estar repetido con los que se han subido previamente. Revise bien que los archivos que desea subir son nuevos y de ser asi puede dar clic nuevamente en Finalizar.'
  ];

  public fileDangerMessage: number = -1;

  public messageText: string = null;

  public accept() { };

  constructor(
    private fbms: FirebaseMethodsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.assetsSubscription = this.fbms.assets.subscribe(assets => {
      this.assets = [...assets];
    });
    this.route.params.subscribe(params => {
      const { type, id } = params;
      this.type = type;
      this.asset = { ...this.assets[this.assets.findIndex(ele => ele.id == id)] };
      console.log(this.asset);
    });
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
    for (let i = 0; i < event.addedFiles.length; i++) {
      let fileProps = event.addedFiles[i].name.split('.');
      if (fileProps.length == 2) {
        if (fileProps[1].toUpperCase() != 'glb'.toUpperCase() && fileProps[1].toUpperCase() != 'fbx'.toUpperCase() && fileProps[1].toUpperCase() != 'obj'.toUpperCase()) {
          formatNotAccepted = true;
          break;
        }
        if (fileProps[1].toUpperCase() == 'glb'.toUpperCase() && this.fileGlb == null) {
          glbPresent = true;
          glbDirection = i;
        } else if (fileProps[1].toUpperCase() == 'glb'.toUpperCase() && this.fileGlb != null) {
          formatRepeated = true;
        }
        if (fileProps[1].toUpperCase() == 'fbx'.toUpperCase() && this.fileFbx == null) {
          fbxPresent = true;
          fbxDirection = i;
        } else if (fileProps[1].toUpperCase() == 'fbx'.toUpperCase() && this.fileFbx != null) {
          formatRepeated = true;
        }
        if (fileProps[1].toUpperCase() == 'obj'.toUpperCase() && this.fileObj == null) {
          objPresent = true;
          objDirection = i;
        } else if (fileProps[1].toUpperCase() == 'obj'.toUpperCase() && this.fileObj != null) {
          formatRepeated = true;
        }
      } else {
        formatNotAccepted = true;
        break;
      }
    }
    if (formatNotAccepted) {
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      }, 5000);
      return;
    }
    if (formatRepeated) {
      this.fileDangerMessage = 0;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      }, 5000);
      return;
    }
    if (glbPresent) {
      this.asset.files.glb.push({ type: 'glb', size: event.addedFiles[glbDirection].size, uploadedBy: this.fbms.sessionData.getValue().name });
      this.fileGlb = event.addedFiles[glbDirection];
    }
    if (fbxPresent) {
      this.asset.files.fbx.push({ type: 'fbx', size: event.addedFiles[fbxDirection].size, uploadedBy: this.fbms.sessionData.getValue().name });
      this.fileFbx = event.addedFiles[fbxDirection];
    }
    if (objPresent) {
      this.asset.files.obj.push({ type: 'obj', size: event.addedFiles[objDirection].size, uploadedBy: this.fbms.sessionData.getValue().name });
      this.fileObj = event.addedFiles[objDirection];
    }
  }

  onRemoveAssetFile(ext) {
    if (ext == 'glb') {
      this.fileGlb = null;
      this.asset.files.glb.pop();
    }
    if (ext == 'fbx') {
      this.fileFbx = null;
      this.asset.files.fbx.pop();
    }
    if (ext == 'obj') {
      this.fileObj = null;
      this.asset.files.obj.pop();
    }
  }

  onDropNewAndroidAssetbundleFile(event) {
    let assetbundlePresent = false;
    let formatNotAccepted = false;
    if (this.fileAndroid != null || event.addedFiles.length > 1) {
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      }, 5000);
      return;
    } else {
      let fileProps = event.addedFiles[0].name.split('.');
      if (fileProps.length == 1) {
        assetbundlePresent = true;
      } else {
        formatNotAccepted = true;
      }

    }
    if (formatNotAccepted) {
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      }, 5000);
      return;
    }
    if (assetbundlePresent) {
      this.asset.files.andab.push({ type: 'andab', size: event.addedFiles[0].size, uploadedBy: this.fbms.sessionData.getValue().name });
    }
    this.fileAndroid = event.addedFiles[0];
  }

  onRemoveAndroidAssetbundleFile() {
    this.fileAndroid = null;
    this.asset.files.andab = [];
  }

  onDropNewIOSAssetbundleFile(event) {
    let assetbundlePresent = false;
    let formatNotAccepted = false;
    if (this.fileIos != null || event.addedFiles.length > 1) {
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      }, 5000);
      return;
    } else {
      let fileProps = event.addedFiles[0].name.split('.');
      if (fileProps.length == 1) {
        assetbundlePresent = true;
      } else {
        formatNotAccepted = true;
      }

    }
    if (formatNotAccepted) {
      this.fileDangerMessage = 1;
      setTimeout(() => {
        this.fileDangerMessage = -1;
      }, 5000);
      return;
    }
    if (assetbundlePresent) {
      this.asset.files.iosab.push({ type: 'iosab', size: event.addedFiles[0].size, uploadedBy: this.fbms.sessionData.getValue().name });
    }
    this.fileIos = event.addedFiles[0];
  }

  onRemoveIOSAssetbundleFile() {
    this.fileIos = null;
    this.asset.files.iosab = [];
  }

  submit() {
    let date = new Date().getTime();
    let promiseArray = [];
    /* console.log(this.fileGlb);
    console.log(this.fileFbx);
    console.log(this.fileObj);
    console.log(this.fileAndroid);
    console.log(this.fileIos);
    console.log(`assets/glb/${this.asset.id}_v${this.asset.files.fbx.length - 1}.fbx`); */
    if (this.type == 'asset') {
      this.asset.createdat = date;
      if (this.fileGlb != null) {
        this.asset.files.glb[this.asset.files.glb.length - 1]['uploadedAt'] = date;
        promiseArray.push(this.fbms.uploadAssetFile(`assets/glb/${this.asset.id}_v${this.asset.files.glb.length - 1}.glb`, this.fileGlb));
      }
      if (this.fileFbx != null) {
        this.asset.files.fbx[this.asset.files.fbx.length - 1]['uploadedAt'] = date;
        promiseArray.push(this.fbms.uploadAssetFile(`assets/fbx/${this.asset.id}_v${this.asset.files.fbx.length - 1}.fbx`, this.fileFbx));
      }
      if (this.fileObj != null) {
        this.asset.files.obj[this.asset.files.obj.length - 1]['uploadedAt'] = date;
        promiseArray.push(this.fbms.uploadAssetFile(`assets/obj/${this.asset.id}_v${this.asset.files.obj.length - 1}.obj`, this.fileObj));
      }
      Promise.all(promiseArray).then(() => {
        this.endForm();
      });
    } else if (this.type == 'assetbundle') {
      this.asset.createdat = date;
      this.asset.files.andab[this.asset.files.andab.length - 1]['uploadedAt'] = date;
      this.asset.files.iosab[this.asset.files.iosab.length - 1]['uploadedAt'] = date;
      promiseArray.push(this.fbms.uploadAssetFile(`assetbundle/android/${this.asset.id}_v${this.asset.files.andab.length - 1}`, this.fileAndroid));
      promiseArray.push(this.fbms.uploadAssetFile(`assetbundle/ios/${this.asset.id}_v${this.asset.files.iosab.length - 1}`, this.fileIos));
      Promise.all(promiseArray).then(() => {
        this.endForm();
      });
    }
  }

  submitAllowance(): boolean {
    if(this.asset.assetbundle){
      if(this.fileAndroid != null && this.fileIos != null){
        return false;
      }else{
        return true;
      }
    }else{
      if(this.fileGlb != null || this.fileFbx != null || this.fileObj != null){
        return false;
      }else{
        return true;
      }
    }
  }
  
  endForm() {
    this.fbms.updateAssetData(this.asset).then(() => {
      this.messageText = 'Tu informacion ha sido enviada exitosamente';
      this.accept = () => {
        this.messageText = null;
        this.router.navigateByUrl('/library');
      }
    });
  }

  ngOnDestroy(): void {
    this.assetsSubscription.unsubscribe();
  }

}
