import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitorFormComponent } from './solicitor-form.component';

describe('SolicitorFormComponent', () => {
  let component: SolicitorFormComponent;
  let fixture: ComponentFixture<SolicitorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
