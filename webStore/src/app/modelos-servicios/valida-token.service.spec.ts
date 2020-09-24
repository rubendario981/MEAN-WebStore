import { TestBed } from '@angular/core/testing';

import { ValidaTokenService } from './valida-token.service';

describe('ValidaTokenService', () => {
  let service: ValidaTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidaTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
