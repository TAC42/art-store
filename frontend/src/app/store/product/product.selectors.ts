import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ProductState } from './product.reducers'

export const selectProductState = createFeatureSelector<ProductState>('product')

// handling of shop loading
export const selectIsLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.isLoading
)

// handling of all products in index
export const selectProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
)

// handling of product in details
export const selectProductByName = createSelector(
  selectProductState,
  (state: ProductState) => state.selectedProduct
)

// handling of product in details
export const selectCart = createSelector(
  selectProductState,
  (state: ProductState) => state.cart
)

// handling of product filtering
export const selectFilterBy = createSelector(
  selectProductState,
  (state: ProductState) => state.filterBy
)

// handling of random products in details
export const selectRandomProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.randomProducts
)