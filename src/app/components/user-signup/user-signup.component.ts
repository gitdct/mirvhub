import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder,
    private firebaseMethodsService: FirebaseMethodsService
  ) { }

  ngOnInit(): void
  {
    this.user = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
      this.messageFadeIn(res);
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

}
