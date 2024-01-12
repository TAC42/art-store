import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { scrollToTopResolver } from './scroll-to-top.resolver';

describe('scrollToTopResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => scrollToTopResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
