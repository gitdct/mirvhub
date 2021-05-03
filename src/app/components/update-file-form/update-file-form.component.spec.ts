import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFileFormComponent } from './update-file-form.component';

describe('UpdateFileFormComponent', () => {
  let component: UpdateFileFormComponent;
  let fixture: ComponentFixture<UpdateFileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
