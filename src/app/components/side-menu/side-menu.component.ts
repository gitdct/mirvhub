import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  public sessionData;
  public sessionDataSubscription: Subscription;

  constructor(
    public firebaseMethodsService: FirebaseMethodsService,
    private ngZone: NgZone
  ) { }

  ngOnInit()
  {
    this.sessionDataSubscription = this.firebaseMethodsService.sessionData.subscribe(data => {
      this.ngZone.run(() => {
        this.sessionData = {...data};
      });
    });
    this.firebaseMethodsService.userStateChanged();
  }

  ngOnDestroy()
  {
    this.sessionDataSubscription.unsubscribe();
  }

}
