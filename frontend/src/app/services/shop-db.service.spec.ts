import { TestBed } from '@angular/core/testing';

import { ShopDbService } from './shop-db.service';

describe('ShopDbService', () => {
  let service: ShopDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
