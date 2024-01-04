import { ActionReducerMap, createReducer, on } from '@ngrx/store'
import { productsLoaded, loadProductByName, filterUpdated, loadFilter, setLoadingState, saveProduct } from './shop.actions'
import { Product, ShopFilter } from '../models/shop'
import { AppState } from './app.state'

export interface ShopState {
  products: Product[]
  filterBy: ShopFilter
  isLoading: boolean
}

export const initialState: ShopState = {
  products: [],
  filterBy: { search: '' },
  isLoading: false,
}

export const shopReducer = createReducer(
  initialState,
  on(productsLoaded, (state, { products }) => ({
    ...state,
    products: products,
  })),
  on(loadProductByName, (state, { name }) => ({
    ...state,
    selectedProduct: state.products.find((product) => product.name === name) || null,
  })),
  on(filterUpdated, (state, { updatedFilter }) => ({
    ...state,
    filterBy: { ...state.filterBy, ...updatedFilter },
  })),
  on(loadFilter, (state) => ({
    ...state, filterBy: { search: '', }
  })),
  on(setLoadingState, (state, { isLoading }) => ({
    ...state,
    isLoading: isLoading,
  })),
  on(saveProduct, (state, { product }) => {
    // Logic to save or update the product in the state
    let updatedProducts: Product[] = []
    const existingProductIndex = state.products.findIndex((p) => p._id === product._id)

    if (existingProductIndex !== -1) {
      updatedProducts = [
        ...state.products.slice(0, existingProductIndex),
        product,
        ...state.products.slice(existingProductIndex + 1),
      ]
    } else {
      // If the product is new, add it to the list
      updatedProducts = [...state.products, product]
    }

    return {
      ...state,
      products: updatedProducts,
    }
  }),

)

export const reducers: ActionReducerMap<AppState> = {
  shop: shopReducer,
}
