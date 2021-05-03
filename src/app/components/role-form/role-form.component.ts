import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {

  public modalOpen: boolean = false;

  private roles = [];
  private rolesSubscription: Subscription;

  public roleAlreadyExists: boolean;
  public roleCreationSuccess: boolean;

  public newRole;

  constructor(private fbms: FirebaseMethodsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newRole = {
      value: null
    }
    this.roleAlreadyExists = false;
    this.roleCreationSuccess = false;
    this.rolesSubscription = this.fbms.roles.subscribe(data => {
      this.roles = [...data];
    });
    this.modalOpen = true;
  }

  submitRole() {
    for(let i=0;i<this.roles.length;i++){
      if(this.newRole.value == this.roles[i].value){
        this.roleAlreadyExists = true;
        break;
      }else{
        this.roleAlreadyExists = false;
      }
    }
    if(!this.roleAlreadyExists){
      this.fbms.createRole(this.newRole);
      this.roleCreationSuccess = true;
      setTimeout(() => {
        this.router.navigate(['../'], {relativeTo: this.route});
      },4000);
    }else{
      setTimeout(() => {
        this.roleAlreadyExists = false;
      },4000);
    }
  }


  ngOnDestroy() {
    this.rolesSubscription.unsubscribe();
  }

}
