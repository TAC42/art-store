import { createAction, props } from '@ngrx/store'
import { Product, ShopFilter, Cart } from '../../models/product'

// handling of product loading
export const SET_LOADING_STATE = createAction(
  '[Product] Set Loading State',
  props<{ isLoading: boolean }>()
)

// handling of all products in index
export const LOAD_PRODUCTS = createAction(
  '[Product] Load Products',
  props<{ filterBy: ShopFilter }>()
)
export const PRODUCTS_LOADED = createAction(
  '[Product] Products Loaded',
  props<{ products: Product[] }>()
)

// handling of product in details
export const LOAD_PRODUCT_BY_NAME = createAction(
  '[Product] Load Product By Name',
  props<{ name: string }>()
)
export const PRODUCT_BY_NAME_LOADED = createAction(
  '[Product] Product By Name Loaded',
  props<{ product: Product | null }>()
)

// handling of user's products cart
export const LOAD_CART = createAction(
  '[Product] Load Cart',
  props<{ userCart: Cart[] }>()
)
export const CART_LOADED = createAction(
  '[Product] Cart Loaded',
  props<{ cart: Product[] }>()
)

// handling of random products in details
export const LOAD_RANDOM_PRODUCTS = createAction(
  '[Product] Load Random Products',
  props<{ productType: string, excludeProductId: string }>()
)
export const RANDOM_PRODUCTS_LOADED = createAction(
  '[Product] Random Products Loaded',
  props<{ randomProducts: Product[] }>()
)

// handling of product filtering
export const LOAD_FILTER = createAction(
  '[Product] Load Filter',
  props<{ filterBy: Partial<ShopFilter> }>()
)
export const FILTER_UPDATED = createAction(
  '[Product] Filter Updated',
  props<{ updatedFilter: Partial<ShopFilter> }>()
)

// handling of product saving
export const SAVE_PRODUCT = createAction(
  '[Product] Save Product',
  props<{ product: Product }>()
)
export const PRODUCT_SAVED = createAction(
  '[Product] Product Saved',
  props<{ product: Product }>()
)

// handling of product deletion
export const REMOVE_PRODUCT = createAction(
  '[Product] Remove Product',
  props<{ productId: string }>()
)
export const PRODUCT_REMOVED_SUCCESSFULLY = createAction(
  '[Product] Product Removed Successfully',
  props<{ productId: string }>()
)
