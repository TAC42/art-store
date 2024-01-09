import { createReducer, on } from '@ngrx/store'
import { PRODUCTS_LOADED, SET_PRODUCT_BY_NAME, FILTER_UPDATED, LOAD_FILTER, SET_LOADING_STATE, SAVE_PRODUCT } from './shop.actions'
import { Product, ShopFilter } from '../models/shop'
import { ShopDbService } from '../services/shop-db.service'

export interface ShopState {
  products: Product[]
  selectedProduct: Product | null
  filterBy: ShopFilter
  isLoading: boolean
}

export const initialState: ShopState = {
  products: [], 
  selectedProduct: null,
  filterBy: { search: '' },
  isLoading: false,
}

export const shopReducer = createReducer(
  initialState,
  on(PRODUCTS_LOADED, (state, { products }) => ({
    ...state,
    products: products,
  })),
  on(SET_PRODUCT_BY_NAME, (state, { product }) => ({
    ...state,
    selectedProduct: product,
  })),
  on(FILTER_UPDATED, (state, { updatedFilter }) => ({
    ...state,
    filterBy: { ...state.filterBy, ...updatedFilter },
  })),
  on(LOAD_FILTER, (state) => ({
    ...state, filterBy: { search: '', }
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
)
