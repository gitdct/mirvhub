import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  @Input()
  signup: boolean = false;
  signupView: boolean = false;
  submitted: boolean = false;
  messageDisplay: boolean = false;
  messageText: string;
  user: FormGroup;
  closesignup: boolean = false;

  constructor(
    private fb: FormBuilder,
    private firebaseMethodsService: FirebaseMethodsService
  ) { }

  ngOnInit(): void
  {
    this.user = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._-]+@tec.mx$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      valid_password: ['', [Validators.required, Validators.minLength(6), this.checkPasswords]]
    });
    this.signupView = true;
  }

  get f() { return this.user.controls };
  
  onSubmit()
  {
    this.submitted = true;

    if(this.user.invalid){
      return;
    }

    const response = this.firebaseMethodsService.createUser(this.user.value).then((res) => {
      this.closesignup = res.resbool;
      this.messageFadeIn(res.text);
    });
    
    this.submitted = false;
  }

  @Output() modalUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  cancel()
  {
    this.modalUpdate.emit(false);
  }

  messageFadeIn(txt)
  {
    this.messageText = txt;
    this.signupView = false;
    this.messageDisplay = true;
  }

  messageFadeOut()
  {
    this.ngOnInit();
    this.signupView = true;
    this.messageDisplay = false;
  }

  checkPasswords(control: AbstractControl) {
    if(control.parent){
      if(control.value !== control.parent.controls['password'].value){
        return { notSame: true };
      }else{
        return null;
      }
    }
  }
}
