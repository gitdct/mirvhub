import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Solicitor } from '../../models/Asset';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-solicitor-form',
  templateUrl: './solicitor-form.component.html',
  styleUrls: ['./solicitor-form.component.css']
})
export class SolicitorFormComponent implements OnInit, OnDestroy {

  private solicitorsSubscription: Subscription;
  private rolesSubscription: Subscription;
  private subjectsSubscription: Subscription;

  public modalOpen: boolean = false;
  public solicitorCreationSuccess: boolean = false;
  public solicitorAlreadyExists: boolean = false;

  public newSolicitor: Solicitor;

  public solicitors: Solicitor[] = [];
  public roles: any[] = [];
  public subjects: any[] = [];

  constructor(private fbMS: FirebaseMethodsService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.solicitorsSubscription = this.fbMS.solicitors.subscribe(data => {
      this.solicitors = [...data];
    });
    this.rolesSubscription = this.fbMS.roles.subscribe(data => {
      this.roles = [...data];
    });
    this.subjectsSubscription = this.fbMS.subjects.subscribe(data => {
      this.subjects = [...data];
    });
    this.modalOpen = true;
    this.newSolicitor = {
      name: null,
      email: null,
      subject: null,
      role: null,
    };
  }

  submitSolicitor (): void {
    for(let i=0;i<this.solicitors.length;i++){
      if(this.newSolicitor.name == this.subjects[i].name || this.newSolicitor.email == this.subjects[i].email || this.newSolicitor.subject == this.subjects[i].subject || this.newSolicitor.role == this.subjects[i].role){
        this.solicitorAlreadyExists = true;
        break;
      }else{
        this.solicitorAlreadyExists = false;
      }
    }
    if(!this.solicitorAlreadyExists){
      this.fbMS.createSolicitor(this.newSolicitor);
      this.solicitorCreationSuccess = true;
      setTimeout(() => {
        this.router.navigate(['../'], {relativeTo: this.route});
      },4000);
    }else{
      setTimeout(() => {
        this.solicitorAlreadyExists = false;
      },4000);
    }
  }
  
  ngOnDestroy(): void {
    this.solicitorsSubscription.unsubscribe();
    this.rolesSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
  }

}
