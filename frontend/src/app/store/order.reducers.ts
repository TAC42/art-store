import { createReducer, on } from '@ngrx/store'
import {
  ORDERS_LOADED, FILTER_UPDATED,
  LOAD_FILTER, SET_LOADING_STATE,
  ORDER_REMOVED_SUCCESSFULLY, ORDER_SAVED
} from './order.actions'
import { Order, OrderFilter } from '../models/order'

export interface OrderState {
  orders: Order[]
  selectedOrder: Order | null
  filterBy: OrderFilter
  isLoading: boolean
}

export const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  filterBy: { _id: '' },
  isLoading: false,
}

export const orderReducer = createReducer(
  initialState,
  // handling of order loading
  on(SET_LOADING_STATE, (state, { isLoading }) => ({
    ...state, isLoading: isLoading,
  })),
  // handling of orders in dashboard
  on(ORDERS_LOADED, (state, { orders }) => ({
    ...state, orders: orders,
  })),
  // handling of order filtering
  on(LOAD_FILTER, (state, { filterBy }) => ({
    ...state, filterBy
  })),
  on(FILTER_UPDATED, (state, { updatedFilter }) => ({
    ...state, filterBy: { ...state.filterBy, ...updatedFilter },
  })),
  // handling of order saving
  on(ORDER_SAVED, (state, { order }) => {
    let updatedOrders = [...state.orders]
    const existingOrderIndex = updatedOrders.findIndex(p => p._id === order._id)

    if (existingOrderIndex !== -1)
      updatedOrders[existingOrderIndex] = order
    else updatedOrders.push(order)

    return {
      ...state, orders: updatedOrders,
    }
  }),
  // handling of product deletion
  on(ORDER_REMOVED_SUCCESSFULLY, (state, { orderId }) => ({
    ...state, orders: state.orders.filter(p => p._id !== orderId),
  }))
)
