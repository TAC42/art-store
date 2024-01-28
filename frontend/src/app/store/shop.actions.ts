import { createAction, props } from '@ngrx/store'
import { Product, ShopFilter } from '../models/shop'

export const LOAD_PRODUCTS = createAction(
  '[Shop] Load Products',
  props<{ filterBy: ShopFilter }>())

export const PRODUCTS_LOADED = createAction(
  '[Shop] Products Loaded',
  props<{ products: Product[] }>())

export const LOAD_PRODUCT_BY_NAME = createAction(
  '[Shop] Load Product By Name',
  props<{ name: string }>())

export const SET_PRODUCT_BY_NAME = createAction(
  '[Shop] Set Product By Name',
  props<{ product: Product | null }>())

export const FILTER_UPDATED = createAction(
  '[Shop] Filter Updated',
  props<{ updatedFilter: Partial<ShopFilter> }>())

export const LOAD_FILTER = createAction(
  '[Shop] Load Filter',
  props<{ filterBy: Partial<ShopFilter> }>())

export const SET_LOADING_STATE = createAction('[Shop] Set Loading State',
  props<{ isLoading: boolean }>())

export const SAVE_PRODUCT = createAction(
  '[Shop] Save Product',
  props<{ product: Product }>())

export const REMOVE_PRODUCT = createAction(
  '[Shop] Remove Product',
  props<{ productId: string }>())

export const PRODUCT_REMOVED_SUCCESSFULLY = createAction(
  '[Shop] Product Removed Successfully',
  props<{ productId: string }>()
)

// handling of random products
export const LOAD_RANDOM_PRODUCTS = createAction(
  '[Shop] Load Random Products',
  props<{ productType: string, excludeProductId: string }>()
)

export const RANDOM_PRODUCTS_LOADED = createAction(
  '[Shop] Random Products Loaded',
  props<{ randomProducts: Product[] }>()
)