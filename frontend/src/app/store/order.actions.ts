import { createAction, props } from '@ngrx/store'
import { Order, OrderFilter } from '../models/order'

// handling of order loading
export const SET_LOADING_STATE = createAction(
  '[Order] Set Loading State',
  props<{ isLoading: boolean }>()
)

// handling of all products in index
export const LOAD_ORDERS = createAction(
  '[Order] Load Orders',
  props<{ filterBy: OrderFilter }>()
)
export const ORDERS_LOADED = createAction(
  '[Order] Orders Loaded',
  props<{ orders: Order[] }>()
)

// handling of product filtering
export const LOAD_FILTER = createAction(
  '[Order] Load Filter',
  props<{ filterBy: Partial<OrderFilter> }>()
)
export const FILTER_UPDATED = createAction(
  '[Order] Filter Updated',
  props<{ updatedFilter: Partial<OrderFilter> }>()
)

// handling of order saving
export const SAVE_ORDER = createAction(
  '[Order] Save Order',
  props<{ order: Order }>()
)
export const ORDER_SAVED = createAction(
  '[Order] Order Saved',
  props<{ order: Order }>()
)

// handling of order deletion
export const REMOVE_ORDER = createAction(
  '[Order] Remove Order',
  props<{ orderId: string }>()
)
export const ORDER_REMOVED_SUCCESSFULLY = createAction(
  '[Order] Order Removed Successfully',
  props<{ orderId: string }>()
)
