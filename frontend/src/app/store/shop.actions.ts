import { createAction, props } from '@ngrx/store'
import { Product } from '../models/shop'

export const loadProducts = createAction('[Shop] Load Products')
export const productsLoaded = createAction('[Shop] Products Loaded', props<{ products: Product[] }>())

// Other actions for add, update, remove, etc., can be defined similarly
