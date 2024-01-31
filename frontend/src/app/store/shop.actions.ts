import { createAction, props } from '@ngrx/store'
import { Product, ShopFilter, Cart } from '../models/shop'

// handling of shop loading
export const SET_LOADING_STATE = createAction(
  '[Shop] Set Loading State',
  props<{ isLoading: boolean }>()
)

// handling of all products in index
export const LOAD_PRODUCTS = createAction(
  '[Shop] Load Products',
  props<{ filterBy: ShopFilter }>()
)
export const PRODUCTS_LOADED = createAction(
  '[Shop] Products Loaded',
  props<{ products: Product[] }>()
)

// handling of product in details
export const LOAD_PRODUCT_BY_NAME = createAction(
  '[Shop] Load Product By Name',
  props<{ name: string }>()
)
export const PRODUCT_BY_NAME_LOADED = createAction(
  '[Shop] Product By Name Loaded',
  props<{ product: Product | null }>()
)

// handling of product in details
export const LOAD_CART = createAction(
  '[Shop] Load Product By Name',
  props<{ userCart: Product[] }>()
)
export const CART_LOADED = createAction(
  '[Shop] Product By Name Loaded',
  props<{ cart: Product[]}>()
)
// handling of random products in details
export const LOAD_RANDOM_PRODUCTS = createAction(
  '[Shop] Load Random Products',
  props<{ productType: string, excludeProductId: string }>()
)
export const RANDOM_PRODUCTS_LOADED = createAction(
  '[Shop] Random Products Loaded',
  props<{ randomProducts: Product[] }>()
)

// handling of product filtering
export const LOAD_FILTER = createAction(
  '[Shop] Load Filter',
  props<{ filterBy: Partial<ShopFilter> }>()
)
export const FILTER_UPDATED = createAction(
  '[Shop] Filter Updated',
  props<{ updatedFilter: Partial<ShopFilter> }>()
)

// handling of product saving
export const SAVE_PRODUCT = createAction(
  '[Shop] Save Product',
  props<{ product: Product }>()
)
export const PRODUCT_SAVED = createAction(
  '[Shop] Product Saved',
  props<{ product: Product }>()
)

// handling of product deletion
export const REMOVE_PRODUCT = createAction(
  '[Shop] Remove Product',
  props<{ productId: string }>()
)
export const PRODUCT_REMOVED_SUCCESSFULLY = createAction(
  '[Shop] Product Removed Successfully',
  props<{ productId: string }>()
)
