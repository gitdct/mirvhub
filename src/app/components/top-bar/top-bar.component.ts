import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  public login: boolean = false;
  public signup: boolean = false;
  public sessionData;
  public sessionDataSubscription: Subscription;

  constructor(
    public firebaseMethodsService: FirebaseMethodsService,
    private ngZone: NgZone
  ) {  }

  ngOnInit()
  {
    this.sessionDataSubscription = this.firebaseMethodsService.sessionData.subscribe(data => {
      this.ngZone.run(() => {
        this.sessionData = {...data};
      });
    });
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
  }

  ngOnDestroy() {
    this.sessionDataSubscription.unsubscribe();
  }
}
