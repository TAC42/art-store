import { createAction, props } from '@ngrx/store'
import { Product } from '../models/shop'

export const loadProducts = createAction('[Shop] Load Products')
export const productsLoaded = createAction('[Shop] Products Loaded', props<{ products: Product[] }>())

// Action to load a product by name
export const loadProductByName = createAction(
    '[Shop] Load Product By Name',
    props<{ name: string }>()
  )
