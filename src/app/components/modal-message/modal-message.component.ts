import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent {

  @Input() public messageTitle: string;
  @Input() public messageText: string;

  @Output() public accept: EventEmitter<any> = new EventEmitter();
  public cancel: Function = null;

  acceptClicked()
  {
    this.accept.emit();
  }

}
