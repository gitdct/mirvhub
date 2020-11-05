import { Component, OnInit, NgZone } from '@angular/core';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

export let userName;

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  login: boolean = false;
  signup: boolean = false;
  
  sessionData: {active: false, abbreviatedName: null, name: null};

  constructor(
    private firebaseMethodsService: FirebaseMethodsService,
    private ngZone: NgZone
  ) {  }

  ngOnInit()
  {
    this.firebaseMethodsService.sessionIsActive().subscribe(
      sessionData => {
        this.ngZone.run(() => {
          this.sessionData = sessionData;
        });
      }
    );
    this.firebaseMethodsService.userStateChanged();
  }

  loginInit()
  {
    this.login = true;
    return false;
  }

  signupInit()
  {
    this.signup = true;
    return false;
  }

  modalUpdate()
  {
    this.login = false;
    this.signup = false;
  }

  signOut()
  {
    this.firebaseMethodsService.userSignOut();
    /* this.userName = null; */
  }
}
