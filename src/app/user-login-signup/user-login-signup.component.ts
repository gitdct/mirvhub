import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login-signup',
  templateUrl: './user-login-signup.component.html',
  styleUrls: ['./user-login-signup.component.css']
})
export class UserLoginSignupComponent implements OnInit {

  @Input()
  signup: boolean = false;

  user: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void
  {
    console.log(this.signup);
    this.user = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get f() { return this.user.controls };
  
  onSubmit()
  {
    this.submitted = true;

    if(this.user.invalid){
      return;
    }

    this.submitted = false;
  }

  @Output() modalUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  cancel()
  {
    this.modalUpdate.emit(false);
  }

}
