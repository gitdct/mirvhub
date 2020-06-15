import { Component, OnInit } from '@angular/core';
import {Model} from '../model'

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  
  Models = [
    new Model('Manzana','#','nolink','nolink',[],'',[]),

  ];

  constructor() { }

  ngOnInit(): void {
  }

}
