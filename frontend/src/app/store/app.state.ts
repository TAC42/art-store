import { ShopState } from './shop.reducers'
import { UserState } from './user.reducers'
import { ActionReducerMap } from '@ngrx/store'
import { shopReducer } from './shop.reducers'
import { userReducer } from './user.reducers'
// Import other state interfaces if applicable

export interface AppState {
  shop: ShopState
  user: UserState
  // Add other slices of state if needed
}

export const reducers: ActionReducerMap<AppState> = {
  shop: shopReducer,
  user: userReducer
}