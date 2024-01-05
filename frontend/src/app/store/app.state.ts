import { ShopState } from './shop.reducers'
import { UserState } from './user.reducers'
// Import other state interfaces if applicable

export interface AppState {
  shop: ShopState
  user: UserState
  // Add other slices of state if needed
}