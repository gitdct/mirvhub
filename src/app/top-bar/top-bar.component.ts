import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  signup: boolean = false;

  signupInit()
  {
    this.signup = true;
    return false;
  }

  modalUpdate(e)
  {
    this.signup = e;
  }


}
