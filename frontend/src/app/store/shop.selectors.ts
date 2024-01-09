import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ShopState } from './shop.reducers'

export const selectShopState = createFeatureSelector<ShopState>('shop')

export const selectProducts = createSelector(
  selectShopState,
  (state: ShopState) => state.products)

export const selectProductByName = createSelector(
  selectShopState,
  (state: ShopState) => state.selectedProduct)

export const selectFilterBy = createSelector(
  selectShopState,
  (state: ShopState) => state.filterBy)

export const selectIsLoading = createSelector(
  selectShopState,
  (state: ShopState) => state.isLoading)
