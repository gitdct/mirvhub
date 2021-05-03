import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-edition-form',
  templateUrl: './edition-form.component.html',
  styleUrls: ['./edition-form.component.css']
})
export class EditionFormComponent implements OnInit, OnDestroy {

  private assets;
  public solicitors;
  public roles;
  public subjects;
  public tags;
  public solicitorForm = {
    name: null,
    email: null,
    subject: null,
    role: null,
  };
  public asset = {
    name: '',
    description: null,
    createdat: null,
    createdby: null,
    solicitor: null,
    tags: [],
    files: {fbx: [], glb: [], obj: [], andab: [], iosab: []},
    target: false,
    assetbundle: false,
    imgext: null,
    imgURL: null
  }

  private assetsSubscription: Subscription;
  private solicitorsSubscription: Subscription;
  private rolesSubscription: Subscription;
  private subjectsSubscription: Subscription;
  private tagsSubscription: Subscription;

  public fileImage: File = null;

  public fileDangerMessage: number = -1;

  public tagsSelected: any[];

  public imgURL: string = null;
  public messageText: string = null;

  public accept() {};

  public fileMessages: string[] = [
    'Algun archivo que desea subir tiene extensión duplicada, solamente puede subir un archivo por extensión (.glb, .fbx, .obj)',
    'Algun archivo que desea subir no esta permitido. Verifique bien los archivos que esta subiendo.',
    'El tipo de archivo que desea subir no esta permitido. Solo se permiten formatos jpg o png.',
    'Solamente puede subir una imagen de previsualización por registro.',
    'Registro ya existente, verifique bien la información que esta por subir',
    'Algun archivo que desea subir puede estar repetido con los que se han subido previamente. Revise bien que los archivos que desea subir son nuevos y de ser asi puede dar clic nuevamente en Finalizar.'
  ];

  constructor(
    private fbms: FirebaseMethodsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.assetsSubscription = this.fbms.assets.subscribe(assets => {
      this.assets = [...assets];
    });
    this.solicitorsSubscription = this.fbms.solicitors.subscribe(solicitors => {
      this.solicitors = [...solicitors];
    });
    this.rolesSubscription = this.fbms.roles.subscribe(roles => {
      this.roles = [...roles];
    });
    this.subjectsSubscription = this.fbms.subjects.subscribe(subjects => {
      this.subjects = [...subjects];
    });
    this.tagsSubscription = this.fbms.tags.subscribe(tags => {
      this.tags = [...tags];
    });
    this.route.params.subscribe(params => {
      const { id } = params;
      this.asset = {...this.assets[this.assets.findIndex(ele => ele.id == id)]};
      this.imgURL = {...this.asset}.imgURL;
      delete this.asset.imgURL;
      if(typeof(this.asset.tags) != 'undefined'){
        if(this.asset.tags.length > 0){
          this.tagsSelected = [...{...this.asset}.tags];
        }
      }
      if(typeof(this.asset.solicitor) != 'undefined'){
        this.selectSolicitor(this.solicitors[this.solicitors.findIndex(ele => ele.id == this.asset.solicitor)])
      }
    });
  }

  submit() {
    this.fbms.updateAssetData(this.asset).then((id) => {
      if(this.fileImage != null){
        this.fbms.uploadAssetFile(`img/${id}.${this.asset.imgext}`, this.fileImage).then(async() => {
          const imgUrl = await this.fbms.getImageUrl(id, this.asset.imgext);
          this.fbms.updateAssetImgUrl(id, imgUrl);
          this.endForm();
        });
      }else{
        this.endForm();
      }
    });
  }

  endForm(){
    this.messageText = 'Tu información ha sido actualizada exitosamente';
    this.accept = () => {
      this.messageText = null;
      this.router.navigateByUrl('/library');
    }
  }

  selectSolicitor(solicitor) {
    this.asset.solicitor = {...solicitor}.id;
    this.solicitorForm = {...solicitor};
    this.solicitorForm.subject = this.subjects[this.subjects.findIndex(({id}) => id == solicitor.subject)].value;
    this.solicitorForm.role = this.roles[this.roles.findIndex(({id}) => id == solicitor.role)].value;
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
        this.asset.imgext = fileProps[1].toLowerCase();
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
    this.asset.imgext = null;
  }

  onTagSelect(id, event) {
    if(event.target.classList.contains('label-light-blue')){
      this.tagsSelected.push(id);
      this.asset.tags.push(id);
    }else{
      this.tagsSelected.splice(this.tagsSelected.indexOf(id), 1);
      this.asset.tags.splice(this.asset.tags.indexOf(id), 1);
    }
  }

  getTagName(idtag) {
    return this.tags[this.tags.findIndex(({id}) => id == idtag)].tag;
  }

  ngOnDestroy(): void {
    this.assetsSubscription.unsubscribe();
    this.solicitorsSubscription.unsubscribe();
    this.rolesSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }

}
