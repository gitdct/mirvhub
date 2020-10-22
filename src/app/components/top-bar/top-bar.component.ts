import { Component, OnInit, NgZone } from '@angular/core';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  login: boolean = false;
  signup: boolean = false;
  userName: string = null;
  sessionData: {active: false, name: null};

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
          console.log(this.sessionData);
          console.log(sessionData);
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
