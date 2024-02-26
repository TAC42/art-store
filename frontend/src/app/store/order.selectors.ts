import { createFeatureSelector, createSelector } from '@ngrx/store'
import { OrderState } from './order.reducers'

export const selectOrderState = createFeatureSelector<OrderState>('order')

// handling of order loading
export const selectIsLoading = createSelector(
  selectOrderState,
  (state: OrderState) => state.isLoading
)

// handling of all products in index
export const selectOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.orders
)

// handling of product filtering
export const selectFilterBy = createSelector(
  selectOrderState,
  (state: OrderState) => state.filterBy
)

