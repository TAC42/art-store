import { createReducer, on } from '@ngrx/store'
import {
  PRODUCTS_LOADED, SET_PRODUCT_BY_NAME, FILTER_UPDATED,
  LOAD_FILTER, SET_LOADING_STATE, SAVE_PRODUCT,
  PRODUCT_REMOVED_SUCCESSFULLY, RANDOM_PRODUCTS_LOADED
} from './shop.actions'
import { Product, ShopFilter } from '../models/shop'

export interface ShopState {
  products: Product[]
  randomProducts: Product[]
  selectedProduct: Product | null
  filterBy: ShopFilter
  isLoading: boolean
}

export const initialState: ShopState = {
  products: [],
  randomProducts: [],
  selectedProduct: null,
  filterBy: { search: '' },
  isLoading: false,
}

export const shopReducer = createReducer(
  initialState,
  // handling of products in index
  on(PRODUCTS_LOADED, (state, { products }) => ({
    ...state,
    products: products,
  })),
  // handling of products in details
  on(RANDOM_PRODUCTS_LOADED, (state, { randomProducts }) => ({
    ...state,
    randomProducts: randomProducts,
  })),
  on(SET_PRODUCT_BY_NAME, (state, { product }) => ({
    ...state,
    selectedProduct: product,
  })),

  on(FILTER_UPDATED, (state, { updatedFilter }) => ({
    ...state,
    filterBy: { ...state.filterBy, ...updatedFilter },
  })),

  on(LOAD_FILTER, (state, { filterBy }) => ({
    ...state, filterBy
  })),

  on(SET_LOADING_STATE, (state, { isLoading }) => ({
    ...state,
    isLoading: isLoading,
  })),

  on(SAVE_PRODUCT, (state, { product }) => {
    let updatedProducts: Product[] = []
    const existingProductIndex = state.products.findIndex((p) => p._id === product._id)

    if (existingProductIndex !== -1) {
      updatedProducts = [
        ...state.products.slice(0, existingProductIndex),
        product,
        ...state.products.slice(existingProductIndex + 1),
      ]
    } else updatedProducts = [...state.products, product]

    return {
      ...state,
      products: updatedProducts,
    }
  }),

  on(PRODUCT_REMOVED_SUCCESSFULLY, (state, { productId }) => ({
    ...state,
    products: state.products.filter(product => product._id !== productId),
  }))
)
