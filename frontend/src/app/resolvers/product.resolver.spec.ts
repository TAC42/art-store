import { TestBed } from '@angular/core/testing'
import { ProductResolver } from './product.resolver'
import { StoreModule } from '@ngrx/store'
import { shopReducer } from '../store/shop.reducers'

describe('ProductResolver', () => {
  let resolver: ProductResolver

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ shop: shopReducer }),
      ],
      providers: [
        ProductResolver,
      ],
    })
    resolver = TestBed.inject(ProductResolver)
  })

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  })
})