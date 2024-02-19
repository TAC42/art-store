import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { paymentResolver } from './payment.resolver';

describe('paymentResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => paymentResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
