import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDocumentsComponent } from './dashboard-documents.component';

describe('DashboardDocumentsComponent', () => {
  let component: DashboardDocumentsComponent;
  let fixture: ComponentFixture<DashboardDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
