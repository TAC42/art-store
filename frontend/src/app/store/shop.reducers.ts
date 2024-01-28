import { createReducer, on } from '@ngrx/store'
import {
  PRODUCTS_LOADED, PRODUCT_BY_NAME_LOADED, FILTER_UPDATED,
  LOAD_FILTER, SET_LOADING_STATE, SAVE_PRODUCT,
  PRODUCT_REMOVED_SUCCESSFULLY, RANDOM_PRODUCTS_LOADED
} from './shop.actions'
import { Product, ShopFilter } from '../models/shop'

export interface ShopState {
  products: Product[]
  selectedProduct: Product | null
  randomProducts: Product[]
  filterBy: ShopFilter
  isLoading: boolean
}

export const initialState: ShopState = {
  products: [],
  selectedProduct: null,
  randomProducts: [],
  filterBy: { search: '' },
  isLoading: false,
}

export const shopReducer = createReducer(
  initialState,
  // handling of shop loading
  on(SET_LOADING_STATE, (state, { isLoading }) => ({
    ...state,
    isLoading: isLoading,
  })),
  // handling of products in index
  on(PRODUCTS_LOADED, (state, { products }) => ({
    ...state,
    products: products,
  })),
  // handling of random products in details
  on(RANDOM_PRODUCTS_LOADED, (state, { randomProducts }) => ({
    ...state,
    randomProducts: randomProducts,
  })),
  // handling of product in details
  on(PRODUCT_BY_NAME_LOADED, (state, { product }) => ({
    ...state,
    selectedProduct: product,
  })),
  // handling of product filtering
  on(LOAD_FILTER, (state, { filterBy }) => ({
    ...state, filterBy
  })),
  on(FILTER_UPDATED, (state, { updatedFilter }) => ({
    ...state,
    filterBy: { ...state.filterBy, ...updatedFilter },
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
