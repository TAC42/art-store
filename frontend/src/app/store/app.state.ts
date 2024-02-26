import { ShopState } from './shop.reducers'
import { UserState } from './user.reducers'
import { ActionReducerMap } from '@ngrx/store'
import { shopReducer } from './shop.reducers'
import { userReducer } from './user.reducers'
import { OrderState, orderReducer } from './order.reducers'
// Import other state interfaces if applicable

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