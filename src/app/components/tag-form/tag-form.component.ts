import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FirebaseMethodsService } from '../../services/firebase-methods.service';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.css']
})
export class TagFormComponent implements OnInit {

  public modalOpen: boolean = false;

  private tags = [];
  private tagsSubscription: Subscription;

  public tagAlreadyExists: boolean;
  public tagCreationSuccess: boolean;

  public newTag;

  constructor(private fbms: FirebaseMethodsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newTag = {
      tag: null
    }
    this.tagAlreadyExists = false;
    this.tagCreationSuccess = false;
    this.tagsSubscription = this.fbms.tags.subscribe(data => {
      this.tags = [...data];
    });
    this.modalOpen = true;
  }

  submitTag() {
    for(let i=0;i<this.tags.length;i++){
      if(this.newTag.tag == this.tags[i].tag){
        this.tagAlreadyExists = true;
        break;
      }else{
        this.tagAlreadyExists = false;
      }
    }
    if(!this.tagAlreadyExists){
      this.fbms.createTag(this.newTag);
      this.tagCreationSuccess = true;
      setTimeout(() => {
        this.router.navigate(['../'], {relativeTo: this.route});
      },3000);
    }else{
      setTimeout(() => {
        this.tagAlreadyExists = false;
      },4000);
    }
  }

  async verifyValues(): Promise<void> {
  }

  ngOnDestroy() {
    this.tagsSubscription.unsubscribe();
  }

}
