import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.css']
})
export class AssetCardComponent {

  @Input() public downloadURL: string;
  @Input() public name: string;
  @Input() public desc: string;
  @Input() public restype: string;
  @Input() public createdat: Date;
  @Input() public img: File;

}
