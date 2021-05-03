import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

import '@cds/core/icon/register.js';
import { ClarityIcons, pencilIcon } from '@cds/core/icon';

ClarityIcons.addIcons(pencilIcon);

@Component({
  selector: 'app-asset-nav-details',
  templateUrl: './asset-nav-details.component.html',
  styleUrls: ['./asset-nav-details.component.css']
})
export class AssetNavDetailsComponent implements OnInit, OnDestroy {

  public asset = null;
  public assetId = null;
  private assets = [];
  private assetsSubscription: Subscription;
  private assetSelectedSubscription: Subscription;
  private solicitorsSubscription: Subscription;
  private subjectSubscription: Subscription;
  private tagsSubscription: Subscription;
  private sessionSubscription: Subscription;

  public sessionName: string = null;

  public isNew: boolean = false;
  public openModal: boolean = false;

  /* public andab: string = null;
  public iosab: string = null;
  public glb: string = null;
  public andab: string = null;
  public andab: string = null; */

  public solicitor;
  public subject;
  public tags: string[] = [];

  constructor(private fbms: FirebaseMethodsService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.assetsSubscription = this.fbms.assets.subscribe(assets => {
      this.assets = [...assets];
      this.updateAssetSelected();
    });
    this.assetSelectedSubscription = this.fbms.assetSelected.subscribe(id => {
      this.assetId = id;
      this.updateAssetSelected();
    });
    this.solicitorsSubscription = this.fbms.solicitors.subscribe(solicitors => {
      this.solicitor = solicitors[solicitors.findIndex(el => el.id == this.asset.solicitor)];
    });
    this.subjectSubscription = this.fbms.subjects.subscribe(subjects => {
      this.subject = subjects[subjects.findIndex(el => el.id == this.solicitor.subject)];
    });
    this.tagsSubscription = this.fbms.tags.subscribe(tags => {
      this.asset.tags.forEach(element => {
        this.tags.push(tags[tags.findIndex(el => el.id == element)].tag);
      });
    });
    this.sessionSubscription = this.fbms.sessionData.subscribe(session => {
      this.sessionName = { ...session }.name;
    });
  }
  
  updateAssetSelected(): void {
    this.ngZone.run(() => {
      this.asset = { ...this.assets[this.assets.findIndex(el => el.id == this.assetId)] };
      let assetDate = new Date(this.asset.createdat);
      let monthBefore = new Date();
      monthBefore.setMonth(monthBefore.getMonth() - 1);
      if (assetDate > monthBefore) {
        this.isNew = true;
      }
    });

  }

  async getAssetUrl(asset, assetType) {
    let url: string = null;
    if (asset.assetbundle) {
      let extension: string = null;
      if (assetType == 'andab') {
        extension = 'android';
      } else if (assetType == 'iosab') {
        extension = 'ios';
      }
      if (typeof (asset.files[assetType]) != 'undefined') {
        if (asset.files[assetType].length <= 1) {
          url = await this.fbms.getAssetUrl(`assetbundle/${extension}/${asset.id}`);
        } else {
          url = await this.fbms.getAssetUrl(`assetbundle/${extension}/${asset.id}_v${asset.files[assetType].length - 1}`);
        }
      }
    } else {
      if (typeof (asset.files[assetType]) != 'undefined') {
        if (asset.files[assetType].length <= 1) {
          url = await this.fbms.getAssetUrl(`assets/${assetType}/${asset.id}.${assetType}`);
        } else {
          url = await this.fbms.getAssetUrl(`assets/${assetType}/${asset.id}_v${asset.files[assetType].length - 1}.${assetType}`);
        }
      }
    }
    window.location.href = url;
  }

  closeDetailse() {
    this.fbms.setAssetSelected(null);
    document.querySelectorAll('.selected').forEach(element => {
      element.classList.remove('selected');
    });
  }

  fileSize(size) {
    const sizeArray = ['B', 'KB', 'MB'];
    let i = 0;
    let sizeString = 0;
    do {
      if ((size / 1024) > 1) {
        size = size / 1024;
        sizeString++;
      } else {
        i++;
      }
    } while (i == 0);
    return size.toFixed(2) + ' ' + sizeArray[sizeString];
  }

  propertyExists(property) {
    if (typeof (property) != 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.assetsSubscription.unsubscribe();
    this.assetSelectedSubscription.unsubscribe();
    this.solicitorsSubscription.unsubscribe();
    this.subjectSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
    this.sessionSubscription.unsubscribe();
  }

}
