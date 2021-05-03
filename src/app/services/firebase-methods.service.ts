import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

export var User:string = null;

@Injectable({
  providedIn: 'root'
})
export class FirebaseMethodsService {

  public sessionData: BehaviorSubject<any> = new BehaviorSubject({active: false, abbreviatedName: null, name: null});
  public assets: BehaviorSubject<any> = new BehaviorSubject([]);
  public tags: BehaviorSubject<any> = new BehaviorSubject([]);
  public roles: BehaviorSubject<any> = new BehaviorSubject([]);
  public subjects: BehaviorSubject<any> = new BehaviorSubject([]);
  public solicitors: BehaviorSubject<any> = new BehaviorSubject([]);
  public assetSelected: BehaviorSubject<any> = new BehaviorSubject(null);

  private task: AngularFireUploadTask;

  private collectionData = [];

  constructor(
    private db: AngularFireDatabase,
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private fireauth: AngularFireAuth,
    private router: Router
  ) {

    this.db.database.ref('/assets').on('child_added', async(snapshot) => {
      let tmpArr = this.assets.getValue();
      const imgUrl = await this.getImageUrl(snapshot.key, snapshot.val().imgext);
      tmpArr.push({ ...{id: snapshot.key, imgURL: imgUrl}, ...snapshot.val()});
      this.assets.next(tmpArr);
    });
    this.db.database.ref('/assets').on('child_removed', snapshot => {
      let tmpArr = this.assets.getValue();
      tmpArr.splice(tmpArr.findIndex(({id}) => id == snapshot.key), 1);
      this.assets.next(tmpArr);
    });
    this.db.database.ref('/assets').on('child_changed', async(snapshot) => {
      let tmpArr = this.assets.getValue();
      const imgUrl = await this.getImageUrl(snapshot.key, snapshot.val().imgext);
      tmpArr[tmpArr.findIndex(({id}) => id == snapshot.key)] = { ...{id: snapshot.key, imgURL: imgUrl}, ...snapshot.val()};
      this.assets.next(tmpArr);
    });

    this.db.database.ref('/tags').on('child_added', snapshot => {
      let tmpArr = this.tags.getValue();
      tmpArr.push({ ...{id: snapshot.key}, ...snapshot.val()});
      this.tags.next(tmpArr);
    });
    this.db.database.ref('/tags').on('child_removed', snapshot => {
      let tmpArr = this.tags.getValue();
      tmpArr.splice(tmpArr.findIndex(({id}) => id == snapshot.key), 1);
      this.tags.next(tmpArr);
    });
    this.db.database.ref('/tags').on('child_changed', snapshot => {
      let tmpArr = this.tags.getValue();
      tmpArr[tmpArr.findIndex(({id}) => id == snapshot.key)] = { ...{id: snapshot.key}, ...snapshot.val()};
      this.tags.next(tmpArr);
    });
        
    this.db.database.ref('/roles').on('child_added', snapshot => {
      let tmpArr = this.roles.getValue();
      tmpArr.push({ ...{id: snapshot.key}, ...snapshot.val()});
      this.roles.next(tmpArr);
    });
    this.db.database.ref('/roles').on('child_removed', snapshot => {
      let tmpArr = this.roles.getValue();
      tmpArr.splice(tmpArr.findIndex(({id}) => id == snapshot.key), 1);
      this.roles.next(tmpArr);
    });
    this.db.database.ref('/roles').on('child_changed', snapshot => {
      let tmpArr = this.roles.getValue();
      tmpArr[tmpArr.findIndex(({id}) => id == snapshot.key)] = { ...{id: snapshot.key}, ...snapshot.val()};
      this.roles.next(tmpArr);
    });
        
    this.db.database.ref('/subjects').on('child_added', snapshot => {
      let tmpArr = this.subjects.getValue();
      tmpArr.push({ ...{id: snapshot.key}, ...snapshot.val()});
      this.subjects.next(tmpArr);
    });
    this.db.database.ref('/subjects').on('child_removed', snapshot => {
      let tmpArr = this.subjects.getValue();
      tmpArr.splice(tmpArr.findIndex(({id}) => id == snapshot.key), 1);
      this.subjects.next(tmpArr);
    });
    this.db.database.ref('/subjects').on('child_changed', snapshot => {
      let tmpArr = this.subjects.getValue();
      tmpArr[tmpArr.findIndex(({id}) => id == snapshot.key)] = { ...{id: snapshot.key}, ...snapshot.val()};
      this.subjects.next(tmpArr);
    });
    
    this.db.database.ref('/solicitors').on('child_added', snapshot => {
      let tmpArr = this.solicitors.getValue();
      tmpArr.push({ ...{id: snapshot.key}, ...snapshot.val()});
      this.solicitors.next(tmpArr);
    });
    this.db.database.ref('/solicitors').on('child_removed', snapshot => {
      let tmpArr = this.solicitors.getValue();
      tmpArr.splice(tmpArr.findIndex(({id}) => id == snapshot.key), 1);
      this.solicitors.next(tmpArr);
    });
    this.db.database.ref('/solicitors').on('child_changed', snapshot => {
      let tmpArr = this.solicitors.getValue();
      tmpArr[tmpArr.findIndex(({id}) => id == snapshot.key)] = { ...{id: snapshot.key}, ...snapshot.val()};
      this.solicitors.next(tmpArr);
    });






  
    /* setTimeout(() => {
      console.log(this.tags.getValue());
    },4000); */
    /* this.db.database.ref('/tags/'+'-MUu5hvqW0xdn-g482J2').once('value').then((snapshot) => {
      console.log(snapshot.exists());
    }) */



    this.db.database.ref('/tags').orderByChild("tag").equalTo("Biologia").once("child_added", snapshot => {
      /* console.log(snapshot.exists());
      if (snapshot.exists()){
        const userData = snapshot.val();
        console.log("exists!", userData);
      } */
    });


  }

  createSubject(data) {
    this.db.database.ref('/subjects').push().set(data);
  }
  
  createRole(data) {
    this.db.database.ref('/roles').push().set(data);
  }
  
  createSolicitor(data) {
    this.db.database.ref('/solicitors').push().set(data);
  }

  createTag(data) {
    this.db.database.ref('/tags').push().set(data);
  }

  waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  setAssetSelected(id): void {
    this.assetSelected.next(id);
  }

  uploadAssetData(data)
  {
    return new Promise(res => {
      let id = this.db.createPushId();
      return this.db.database.ref('assets/' + id).set(data).then(() => {
        res(id);
      });
    });
    /* return new Promise<any>((resolve, reject) => {
      this.firestore
          .collection('assets')
          .add(data)
          .then((docRef) => {
            this.uploadAssetFile(docRef.id);
          }, err => reject(err));
    }) */
  }

  updateAssetData(data): Promise<any>
  {
    return new Promise(res => {
      return this.db.database.ref('assets/' + data.id).set(data).then(() => {
        res(data.id);
      });
    });
  }

  updateAssetImgUrl(id, url)
  {
    let tmpArr = this.assets.getValue();
    tmpArr[tmpArr.findIndex((el) => el.id == id)].imgURL = url;
    this.assets.next(tmpArr);
  }

  async existsValidation(data): Promise<any> {
    return new Promise(res => {
      this.db.database.ref('/assets').orderByChild("name").equalTo(data.name).once("value", snapshot => {
        if(snapshot.exists()){
          res(true);
        }else{
          res(false);
        }
      });
    })
  }

  uploadAssetFile(assetpath, file)
  {
    return new Promise<void>((res) => {
      const ref = this.firestorage.ref(assetpath);
      ref.put(file).then(() => {
        res();
      });
    });
  }

  async getAssetUrl(asset_url): Promise<string>
  {
    return await new Promise(async (res) => {
      return await this.firestorage.ref(asset_url).getDownloadURL().toPromise().then((url) => {
        res(url);
      });
    });
  }

  async getImageUrl(id, ext)
  {
    return this.firestorage.ref('img/' + id + '.' + ext).getDownloadURL().toPromise().then(url => {
      return url;
    });
  }

  createUser = async(user): Promise<any> =>
  {
    let firestore = this.firestore
    return await this.fireauth.createUserWithEmailAndPassword(user.email, user.password).then(async(userCreds) => {
      return await userCreds.user.updateProfile({
        displayName: `${user.name} ${user.lastname}`
      }).then(() => {
        return {resbool: true, text: 'Usuario creado exitosamente'};
      });
      /* firestore
          .collection('users')
          .doc(userCreds.user.uid)
          .set({
            name: user.name,
            lastname: user.lastname
          })
          .then((docRef) => {
            return 'Usuario creado exitosamente';
          }); */
    }).catch(function(error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return {resbool: false, text: `La cuenta ${user.email} ya esta en uso.`};
        case 'auth/invalid-email':
          return {resbool: false, text: `La cuenta ${user.email} es invalida.`};
        case 'auth/operation-not-allowed':
          return {resbool: false, text: `Error! Operación no permitida.`};
        case 'auth/weak-password':
          return {resbool: false, text: 'El password no es lo suficientemente fuerte. Añada caracteres adicionales caracteres especiales y numeros.'};
        default:
          return {resbool: false, text: error.message};
      }
    });
  }

  userLogin = async(user) =>
  {
    let response = {};
    return new Promise<any>((resolve) => {
      /* 'session' */
      return this.fireauth.setPersistence('local').then(_ => {
        return this.fireauth.signInWithEmailAndPassword(user.email, user.password).then((res) => {
          response = {status: true, text: '¡Bienvenido!'};
          resolve(response);
        }).catch((error) => {
          if(error.code == 'auth/user-not-found')
          {
            response = {status: false, text: 'Usuario no encontrado'};
          }
          else if(error.code == 'auth/wrong-password')
          {
            response = {status: false, text: 'Contraseña erronea'};
          }
          resolve(response);
        });
      });

    });
  }

  userStateChanged()
  {
    let response = {};
    let self = this;
    this.fireauth.onAuthStateChanged(function(user) {
      if (user) {
        let name = user.displayName.split(' ');
        response = {active: true, abbreviatedName: `${name[0].substr(0, 1).toUpperCase()}${name[name.length - 1].substr(0, 1).toUpperCase()}`, name: user.displayName};
      } else {
        response = {active: false, abbreviatedName: null, name: null};
        self.router.navigateByUrl('');
      }
      self.sessionData.next(response);
    });
  }

  userSignOut()
  {
    this.fireauth.signOut();
  }
  
}
