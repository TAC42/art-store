import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ShopState } from './shop.reducers'

// Get the entire shop state slice
export const selectShopState = createFeatureSelector<ShopState>('shop');

// Get the products from the shop state
export const selectProducts = createSelector(
  selectShopState,
  (state: ShopState) => state.products
)

// Get a product by name from the products array
export const selectProductByName = (name: string) =>
  createSelector(
    selectProducts,
    (products) => products.find((product) => product.name === name)
  )

export const selectFilterBy = createSelector(
  selectShopState,
  (state: ShopState) => state.filterBy 
)
