import { TestBed } from '@angular/core/testing';

import { DimmerService } from './dimmer.service';

describe('DimmerService', () => {
  let service: DimmerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DimmerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
