import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FirebaseMethodsService } from './firebase-methods.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: FirebaseMethodsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    console.log(this.authService.sessionData.value.active);
    if(!this.authService.sessionData.value.active){
      alert('You are not allowed to view this page. Redirecting to Home!');

      this.router.navigate(['']);
      return false;
    }
    return true;
  }
  
}
