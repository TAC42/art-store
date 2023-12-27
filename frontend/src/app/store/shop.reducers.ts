import { createReducer, on } from '@ngrx/store'
import { productsLoaded } from './shop.actions'
import { Product, ShopFilter } from '../models/shop'
import { ShopDbService } from '../services/shop-db.service'

export interface ShopState {
  products: Product[]
  filterBy: ShopFilter
}

export const initialState: ShopState = {
  products: [],
  filterBy: {
    search: '',
  }
}

export const shopReducer = createReducer(
  initialState,
  on(productsLoaded, (state, { products }) => ({
    ...state,
    products: products,
  })),
  // Other reducer logic for additional actions
)
