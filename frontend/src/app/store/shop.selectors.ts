import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ShopState } from './shop.reducers'

export const selectShopState = createFeatureSelector<ShopState>('shop')

// handling of all products in index
export const selectProducts = createSelector(
  selectShopState,
  (state: ShopState) => state.products)

// handling of product in details
export const selectProductByName = createSelector(
  selectShopState,
  (state: ShopState) => state.selectedProduct)

// handling of product filtering
export const selectFilterBy = createSelector(
  selectShopState,
  (state: ShopState) => state.filterBy)

// handling of shop loading
export const selectIsLoading = createSelector(
  selectShopState,
  (state: ShopState) => state.isLoading)

// handling of random products in details
export const selectRandomProducts = createSelector(
  selectShopState,
  (state: ShopState) => state.randomProducts
)