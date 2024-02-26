import { createReducer, on } from '@ngrx/store'
import {
  PRODUCTS_LOADED, PRODUCT_BY_NAME_LOADED, FILTER_UPDATED,
  LOAD_FILTER, SET_LOADING_STATE,
  PRODUCT_REMOVED_SUCCESSFULLY, RANDOM_PRODUCTS_LOADED, PRODUCT_SAVED, CART_LOADED
} from './shop.actions'
import { Product, ShopFilter } from '../models/shop'

export interface ShopState {
  products: Product[]
  selectedProduct: Product | null
  randomProducts: Product[]
  cart: Product[]
  filterBy: ShopFilter
  isLoading: boolean
}

export const initialState: ShopState = {
  products: [],
  selectedProduct: null,
  randomProducts: [],
  filterBy: { search: '' },
  cart: [],
  isLoading: false,
}

export const shopReducer = createReducer(
  initialState,
  // handling of shop loading
  on(SET_LOADING_STATE, (state, { isLoading }) => ({
    ...state, isLoading: isLoading,
  })),
  // handling of products in index
  on(PRODUCTS_LOADED, (state, { products }) => ({
    ...state, products: products,
  })),
  // handling of products in index
  on(CART_LOADED, (state, { cart }) => ({
    ...state, cart,
  })),
  // handling of random products in details
  on(RANDOM_PRODUCTS_LOADED, (state, { randomProducts }) => ({
    ...state, randomProducts: randomProducts,
  })),
  // handling of product in details
  on(PRODUCT_BY_NAME_LOADED, (state, { product }) => ({
    ...state, selectedProduct: product,
  })),
  // handling of product filtering
  on(LOAD_FILTER, (state, { filterBy }) => ({
    ...state, filterBy
  })),
  on(FILTER_UPDATED, (state, { updatedFilter }) => ({
    ...state, filterBy: { ...state.filterBy, ...updatedFilter },
  })),
  // handling of product saving
  on(PRODUCT_SAVED, (state, { product }) => {
    let updatedProducts = [...state.products]
    const existingProductIndex = updatedProducts.findIndex(p => p._id === product._id)

    if (existingProductIndex !== -1)
      updatedProducts[existingProductIndex] = product
    else updatedProducts.push(product)

    return {
      ...state, products: updatedProducts,
    }
  }),
  // handling of product deletion
  on(PRODUCT_REMOVED_SUCCESSFULLY, (state, { productId }) => ({
    ...state, products: state.products.filter(p => p._id !== productId),
  }))
)
