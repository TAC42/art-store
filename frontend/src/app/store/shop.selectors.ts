import { createSelector, createFeatureSelector } from '@ngrx/store'
import { ShopState } from './shop.reducers'

export const selectShopState = createFeatureSelector<ShopState>('shop')

export const selectProducts = createSelector(
  selectShopState,
  (state: ShopState) => state.products
)

// Other selectors for different parts of the state can be added here
