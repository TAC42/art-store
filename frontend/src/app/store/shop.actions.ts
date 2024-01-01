import { createAction, props } from '@ngrx/store'
import { Product, ShopFilter } from '../models/shop'

export const loadProducts = createAction(
  '[Shop] Load Products',
  props<{ filterBy: ShopFilter }>() // Modify the payload to include filter
)
export const productsLoaded = createAction('[Shop] Products Loaded', props<{ products: Product[] }>())

// Action to load a product by name
export const loadProductByName = createAction(
  '[Shop] Load Product By Name',
  props<{ name: string }>()
)

export const filterUpdated = createAction(
  '[Shop] Filter Updated',
  props<{ updatedFilter: Partial<ShopFilter> }>() 
)

export const loadFilter = createAction('[Shop] Load Filter')