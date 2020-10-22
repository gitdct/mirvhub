import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  @Input()
  login: boolean = false;
  submitted: boolean = false;
  messageDisplay: boolean = false;
  loginView: boolean = false;
  messageText: string = null;
  user: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseMethodsService: FirebaseMethodsService  
  ) {  }

  ngOnInit(): void
  {
    this.user = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.loginView = true;
  }

  get f() { return this.user.controls };

  onSubmit()
  {
    this.submitted = true;

    if(this.user.invalid){
      return;
    }

    this.firebaseMethodsService.userLogin(this.user.value).then((res) => {
      this.messageFadeIn(res);
    });

    this.submitted = false;
  }

  @Output() modalUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  cancel()
  {
    this.modalUpdate.emit();
  }

  messageFadeIn(res)
  {
    if(res.status)
    {
      this.messageText = res.text;
      this.loginView = false;
      this.messageDisplay = true;
      setTimeout(() => {
        this.messageFadeOut();
        this.firebaseMethodsService.userStateChanged();/* REVISAR ESTA FUNCION */
        this.cancel();
      }, 3000);
    }
    else
    {
      this.messageText = res.text;
      this.loginView = false;
      this.messageDisplay = true;
      setTimeout(() => {
        this.messageFadeOut();
      }, 3000);
    }
  }

  messageFadeOut()
  {
    this.ngOnInit();
    this.loginView = true;
    this.messageDisplay = false;
  }

}
