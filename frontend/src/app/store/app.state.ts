import { ActionReducerMap } from '@ngrx/store'
import { ProductState, ProductReducer } from './product/product.reducers'
import { UserState, userReducer } from './user/user.reducers'
import { OrderState, orderReducer } from './order/order.reducers'

export interface AppState {
  product: ProductState
  user: UserState
  order: OrderState
}

export const reducers: ActionReducerMap<AppState> = {
  product: ProductReducer,
  user: userReducer,
  order: orderReducer
}