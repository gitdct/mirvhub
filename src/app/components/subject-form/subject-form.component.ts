import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Subject } from '../../models/Asset';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit, OnDestroy {

  public modalOpen: boolean = false;

  private subjects = [];
  private subjectsSubscription: Subscription;

  public subjectAlreadyExists: boolean;
  public subjectCreationSuccess: boolean;

  public newSubject;

  constructor(private fbms: FirebaseMethodsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.modalOpen = true;
    this.newSubject = {
      key: null,
      value: null
    }
    this.subjectAlreadyExists = false;
    this.subjectCreationSuccess = false;
    this.subjectsSubscription = this.fbms.subjects.subscribe(data => {
      this.subjects = [...data];
    });
  }

  submitSubject() {
    for(let i=0;i<this.subjects.length;i++){
      if(this.newSubject.key == this.subjects[i].key || this.newSubject.value == this.subjects[i].value){
        this.subjectAlreadyExists = true;
        break;
      }else{
        this.subjectAlreadyExists = false;
      }
    }
    if(!this.subjectAlreadyExists){
      this.fbms.createSubject(this.newSubject);
      this.subjectCreationSuccess = true;
      setTimeout(() => {
        this.router.navigate(['../'], {relativeTo: this.route});
      },4000);
    }else{
      setTimeout(() => {
        this.subjectAlreadyExists = false;
      },4000);
    }
  }

  async verifyValues(): Promise<void> {
  }

  ngOnDestroy() {
    this.subjectsSubscription.unsubscribe();
  }

}
