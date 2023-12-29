import { ActionReducerMap, createReducer, on } from '@ngrx/store'
import { productsLoaded, loadProductByName } from './shop.actions'
import { Product, ShopFilter } from '../models/shop'
import { AppState } from './app.state'

export interface ShopState {
  products: Product[]
  filterBy: ShopFilter
}

export const initialState: ShopState = {
  products: [],
  filterBy: {
    search: '',
  },
}

export const shopReducer = createReducer(
  initialState,
  on(productsLoaded, (state, { products }) => ({
    ...state,
    products: products,
  })),
  on(loadProductByName, (state, { name }) => ({
    ...state,
    // Return the product that matches the provided name
    selectedProduct: state.products.find((product) => product.name === name) || null,
  })),
  // Other reducer logic for additional actions
)

// Combine all reducers into one object
export const reducers: ActionReducerMap<AppState> = {
  shop: shopReducer,
  // ... other reducers if present
};
