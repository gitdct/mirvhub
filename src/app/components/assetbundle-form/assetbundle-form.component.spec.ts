import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetbundleFormComponent } from './assetbundle-form.component';

describe('AssetbundleFormComponent', () => {
  let component: AssetbundleFormComponent;
  let fixture: ComponentFixture<AssetbundleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetbundleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetbundleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
