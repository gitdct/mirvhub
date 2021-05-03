import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetNavDetailsComponent } from './asset-nav-details.component';

describe('AssetNavDetailsComponent', () => {
  let component: AssetNavDetailsComponent;
  let fixture: ComponentFixture<AssetNavDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetNavDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetNavDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
