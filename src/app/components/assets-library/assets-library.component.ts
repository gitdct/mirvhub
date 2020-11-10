import { Component, OnInit } from '@angular/core';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-assets-library',
  templateUrl: './assets-library.component.html',
  styleUrls: ['./assets-library.component.css']
})
export class AssetsLibraryComponent implements OnInit {

  public assets: any = [];

  constructor(
    private firebaseMethodsService: FirebaseMethodsService
  ) { }

  ngOnInit(): void {
    this.firebaseMethodsService.getAllAssetsData().then((data) => {
      this.assets = this.chunks(data, 3);
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
    return this.firebaseMethodsService.getAssetUrl(assetId);
  }

}
