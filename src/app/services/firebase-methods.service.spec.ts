import { TestBed } from '@angular/core/testing';

import { FirebaseMethodsService } from './firebase-methods.service';

describe('FirebaseMethodsService', () => {
  let service: FirebaseMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
