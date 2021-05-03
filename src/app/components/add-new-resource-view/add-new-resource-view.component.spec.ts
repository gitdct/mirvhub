import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewResourceViewComponent } from './add-new-resource-view.component';

describe('AddNewResourceViewComponent', () => {
  let component: AddNewResourceViewComponent;
  let fixture: ComponentFixture<AddNewResourceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewResourceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewResourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
