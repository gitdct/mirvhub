import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.css']
})
export class AssetCardComponent implements OnInit {

  @Input() public downloadURL: string;
  @Input() public name: string;
  @Input() public desc: string;
  @Input() public restype: string;
  @Input() public createdat: Date;

  constructor() { }

  ngOnInit(): void {
  }

}
