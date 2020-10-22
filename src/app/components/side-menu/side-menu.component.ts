import { Component, OnInit, NgZone } from '@angular/core';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  sessionData: {active: false, name: null};

  constructor(
    private firebaseMethodsService: FirebaseMethodsService,
    private ngZone: NgZone
  ) { }

  ngOnInit()
  {
    this.firebaseMethodsService.sessionIsActive().subscribe(
      sessionData => this.ngZone.run(() => {this.sessionData = sessionData})
    );
    this.firebaseMethodsService.userStateChanged();
  }

}
