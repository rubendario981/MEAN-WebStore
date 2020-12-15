/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ComunicandoComponentesService } from './ComunicandoComponentes.service';

describe('Service: ComunicandoComponentes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComunicandoComponentesService]
    });
  });

  it('should ...', inject([ComunicandoComponentesService], (service: ComunicandoComponentesService) => {
    expect(service).toBeTruthy();
  }));
});
