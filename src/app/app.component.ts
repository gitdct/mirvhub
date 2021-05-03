import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from './services/firebase-methods.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mirvhub';
  private dataPresentSubscription: Subscription;
  public dataPresent: boolean = false;

  constructor (public fbms: FirebaseMethodsService) { }

  ngOnInit () {
    this.dataPresentSubscription = this.fbms.assetSelected.subscribe(asset => {
      this.dataPresent = asset;
    });
  }

  ngOnDestroy () {
    this.dataPresentSubscription.unsubscribe();
  }
}
