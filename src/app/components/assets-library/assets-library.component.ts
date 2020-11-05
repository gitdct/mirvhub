import { Component, OnInit } from '@angular/core';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-assets-library',
  templateUrl: './assets-library.component.html',
  styleUrls: ['./assets-library.component.css']
})
export class AssetsLibraryComponent implements OnInit {

  constructor(
    private firebaseMethodsService: FirebaseMethodsService
  ) { }

  ngOnInit(): void {
    this.firebaseMethodsService.getAllAssetsData();
  }

}
