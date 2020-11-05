import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsLibraryComponent } from './assets-library.component';

describe('AssetsLibraryComponent', () => {
  let component: AssetsLibraryComponent;
  let fixture: ComponentFixture<AssetsLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
