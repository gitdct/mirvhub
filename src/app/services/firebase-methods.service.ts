import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth'
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMethodsService {

  public sessionData: BehaviorSubject<any> = new BehaviorSubject({active: false, name: null});

  private task: AngularFireUploadTask;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private fireauth: AngularFireAuth,
    private router: Router
  ) { }

  sessionIsActive(): Observable<any>
  {
    return this.sessionData.asObservable();
  }

  uploadAssetData(data)
  {
    return new Promise<any>((resolve, reject) => {
      this.firestore
          .collection('assets')
          .add(data)
          .then((docRef) => {
            this.uploadAssetFile(docRef.id);
          }, err => reject(err));
    })
  }

  uploadAssetFile(id)
  {
    const modelpath = `AssetBundles/${id}`;
    const ref = this.firestorage.ref(modelpath);
    /* this.task = this.firestorage.upload(modelpath, this.assetbundlefile); */
    /* this.percentage = this.task.percentageChanges(); */
    this.firestore.collection('assets').doc(id).update({
      assetbundle: modelpath
    });
  }

  createUser = async(user): Promise<string> =>
  {
    let firestore = this.firestore
    return await this.fireauth.createUserWithEmailAndPassword(user.email, user.password).then(async(userCreds) => {
      return await userCreds.user.updateProfile({
        displayName: `${user.name} ${user.lastname}`
      }).then(() => {
        return 'Usuario creado exitosamente';
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
          return `La cuenta ${user.email} ya esta en uso.`;
        case 'auth/invalid-email':
          return `La cuenta ${user.email} es invalida.`;
        case 'auth/operation-not-allowed':
          return `Error! Operación no permitida.`;
        case 'auth/weak-password':
          return 'El password no es lo suficientemente fuerte. Añada caracteres adicionales caracteres especiales y numeros.';
        default:
          return error.message;
      }
    });
  }

  userLogin = async(user) =>
  {
    let response = {};
    return new Promise<any>((resolve) => {
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
      })
    });
  }

  userStateChanged()
  {
    let response = {};
    let self = this;
    this.fireauth.onAuthStateChanged(function(user) {
      if (user) {
        let name = user.displayName.split(' ');
        response = {active: true, name: `${name[0].substr(0, 1).toUpperCase()}${name[name.length - 1].substr(0, 1).toUpperCase()}`};
      } else {
        response = {active: false, name: null};
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
