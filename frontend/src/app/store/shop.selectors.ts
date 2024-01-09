import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ShopState } from './shop.reducers'

export const selectShopState = createFeatureSelector<ShopState>('shop')

export const selectProducts = createSelector(
  selectShopState,
  (state: ShopState) => state.products)

export const selectProductByName = (name: string) => createSelector(
  selectProducts,
  (products) => products.find((product) => product.name === name))

export const selectFilterBy = createSelector(
  selectShopState,
  (state: ShopState) => state.filterBy)

export const selectIsLoading = createSelector(
  selectShopState,
  (state: ShopState) => state.isLoading)
