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

export const FILTER_UPDATED = createAction(
  '[Shop] Filter Updated',
  props<{ updatedFilter: Partial<ShopFilter> }>())

export const LOAD_FILTER = createAction('[Shop] Load Filter')

export const SET_LOADING_STATE = createAction('[Shop] Set Loading State',
  props<{ isLoading: boolean }>())

export const SAVE_PRODUCT = createAction(
  '[Shop] Save Product',
  props<{ product: Product }>())