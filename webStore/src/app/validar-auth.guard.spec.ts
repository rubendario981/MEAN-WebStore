import { TestBed } from '@angular/core/testing';

import { ValidarAuthGuard } from './validar-auth.guard';

describe('ValidarAuthGuard', () => {
  let guard: ValidarAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidarAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
