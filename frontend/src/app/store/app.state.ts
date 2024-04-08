import { ShopState } from './product/shop.reducers'
import { UserState } from './user/user.reducers'
import { ActionReducerMap } from '@ngrx/store'
import { shopReducer } from './product/shop.reducers'
import { userReducer } from './user/user.reducers'
import { OrderState, orderReducer } from './order/order.reducers'

export interface AppState {
  shop: ShopState
  user: UserState
  order: OrderState
}

export const reducers: ActionReducerMap<AppState> = {
  shop: shopReducer,
  user: userReducer,
  order: orderReducer
}