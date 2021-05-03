import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

/* import '@cds/core/icon/register.js';
import { ClarityIcons, pencilIcon } from '@cds/core/icon';

ClarityIcons.addIcons(pencilIcon); */

@Component({
  selector: 'app-assets-library',
  templateUrl: './assets-library.component.html',
  styleUrls: ['./assets-library.component.css']
})
export class AssetsLibraryComponent implements OnInit, OnDestroy {

  private assetsSubscription: Subscription;

  public assets: any = [];

  public assetSelectedClass;

  constructor(
    private fbMS: FirebaseMethodsService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.assetsSubscription = this.fbMS.assets.subscribe(data => {
      this.ngZone.run(() => {
        this.assets = [...data];
      });
    });
  }

  chunks(array, size)
  {
    let results = [];
    while(array.length){
      results.push(array.splice(0, size));
    }
    return results;
  }

  getAssetUrl(assetId)
  {
    return this.fbMS.getAssetUrl(assetId);
  }

  selectAsset($event, id) {
    this.fbMS.setAssetSelected(id);
    document.querySelectorAll('.selected').forEach(element => {
      element.classList.remove('selected');
    });
    $event.target.classList.add('selected');
  }

  isNew(createdat) {
    let assetDate = new Date(createdat);
    let monthBefore = new Date();
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    if(assetDate > monthBefore){
      return true;
    }else{
      return false;
    }
  }
  
  ngOnDestroy() {
    this.fbMS.setAssetSelected(null);
    this.assetsSubscription.unsubscribe();
  }

}
