import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom, catchError, take } from 'rxjs/operators'
import { forkJoin, of } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { ActivatedRoute } from '@angular/router'
import { AppState } from '../app.state'
import { Product, ProductFilter } from '../../models/product'
import {
  FILTER_UPDATED, LOAD_FILTER, LOAD_PRODUCTS, PRODUCTS_LOADED,
  SAVE_PRODUCT, LOAD_PRODUCT_BY_NAME, SET_LOADING_STATE,
  PRODUCT_BY_NAME_LOADED, REMOVE_PRODUCT, PRODUCT_REMOVED_SUCCESSFULLY,
  LOAD_RANDOM_PRODUCTS, RANDOM_PRODUCTS_LOADED, PRODUCT_SAVED, LOAD_CART, CART_LOADED
} from './product.actions'
import { selectFilterBy } from './product.selectors'
import { ProductService } from '../../services/api/product.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../services/utils/event-bus.service'

@Injectable()

export class ProductEffects {
  private actions$ = inject(Actions)
  private prodService = inject(ProductService)
  private eBusService = inject(EventBusService)
  private activatedRoute = inject(ActivatedRoute)
  private store = inject(Store<AppState>)

  // handling of all products in index
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_PRODUCTS),
      withLatestFrom(this.store.pipe(select(selectFilterBy))),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(([{ }, filterBy]) => this.prodService.query(filterBy).pipe(
        map((products: Product[]) => PRODUCTS_LOADED({ products })),
        catchError(error => {
          console.error('Error loading products:', error)
          return of(SET_LOADING_STATE({ isLoading: false }))
        })
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  loadFilter$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_FILTER),
      withLatestFrom(this.activatedRoute.queryParamMap),
      mergeMap(([{ }, queryParams]) => {
        const filterFromParams = this.getInitialFilter(queryParams)
        return [FILTER_UPDATED({ updatedFilter: filterFromParams })]
      })
    )
  )

  private getInitialFilter(queryParams: any): ProductFilter {
    const filterFromParams: ProductFilter = { search: '' }

    if (queryParams.has('search')) filterFromParams.search = queryParams.get('search') || ''
    return filterFromParams
  }

  // handling of product in details
  loadProductByName$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_PRODUCT_BY_NAME),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(action => this.prodService.getByName(action.name).pipe(
        map(product => { return PRODUCT_BY_NAME_LOADED({ product }) }),
        catchError(error => {
          console.error('Error loading product by name:', error)
          return of(SET_LOADING_STATE({ isLoading: false }))
        }),
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  // handling of product saving
  saveProduct$ = createEffect(() =>
    this.actions$.pipe(ofType(SAVE_PRODUCT),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ product }) => this.prodService.save(product).pipe(
        tap(product => showSuccessMsg('Product Saved!',
          `${product.name} was saved successfully!`, this.eBusService)),
        map(updatedProduct => {
          this.store.dispatch(PRODUCT_BY_NAME_LOADED({ product: updatedProduct }))
          return PRODUCT_SAVED({ product: updatedProduct })
        }),
        catchError(error => {
          console.error('Error saving product:', error)
          showErrorMsg('Failed To Save Product!',
            'Whoops, try again later.', this.eBusService)
          return of(SET_LOADING_STATE({ isLoading: false }))
        }),
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))),
    )
  )

  // handling of product deletion
  removeProduct$ = createEffect(() =>
    this.actions$.pipe(ofType(REMOVE_PRODUCT),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ productId }) => this.prodService.remove(productId).pipe(
        tap(() => showSuccessMsg('Product Removed!',
          `Product was removed successfully!`, this.eBusService)),
        map(() => PRODUCT_REMOVED_SUCCESSFULLY({ productId })),
        catchError(error => {
          console.error('Error removing product:', error)
          showErrorMsg('Failed To Remove Product!',
            'Whoops, try again later.', this.eBusService)
          return of(SET_LOADING_STATE({ isLoading: false }))
        }),
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  // handling of random products in details
  loadRandomProducts$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_RANDOM_PRODUCTS),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ productType, excludeProductId }) => this.prodService.getRandomProducts(
        productType, excludeProductId).pipe(
          map(randomProducts => RANDOM_PRODUCTS_LOADED({ randomProducts })),
          catchError(error => {
            console.error('Error loading random products:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          })
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  loadCart$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_CART),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ userCart }) => {
        const requests = userCart.map(cartItem => {
          if (cartItem._id) {
            return this.prodService.getById(cartItem._id).pipe(
              take(1),
              map((product: Product) => ({ ...product, amount: cartItem.amount })),
              catchError(() => of({ error: true } as const))
            )
          } else return of({ error: true } as const)
        })
        return forkJoin(requests).pipe(
          mergeMap(results => {
            const validProducts: Product[] = results.map(
              result => result as Product)
            return of(CART_LOADED({ cart: validProducts }))
          }),
          catchError(error => {
            console.error('Error loading cart: ', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          })
        )
      }),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )
}