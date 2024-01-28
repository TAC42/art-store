import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom, catchError, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { ShopDbService } from '../services/shop-db.service'
import {
  FILTER_UPDATED, LOAD_FILTER, LOAD_PRODUCTS, PRODUCTS_LOADED,
  SAVE_PRODUCT, LOAD_PRODUCT_BY_NAME, SET_LOADING_STATE,
  PRODUCT_BY_NAME_LOADED, REMOVE_PRODUCT, PRODUCT_REMOVED_SUCCESSFULLY,
  LOAD_RANDOM_PRODUCTS, RANDOM_PRODUCTS_LOADED
} from './shop.actions'
import { Store, select } from '@ngrx/store'
import { AppState } from './app.state'
import { selectFilterBy } from './shop.selectors'
import { ActivatedRoute } from '@angular/router'
import { ShopFilter } from '../models/shop'

@Injectable()
export class ShopEffects {
  private actions$ = inject(Actions)
  private shopDbService = inject(ShopDbService)
  private activatedRoute = inject(ActivatedRoute)
  private store = inject(Store<AppState>)

  // handling of all products in index
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_PRODUCTS),
      withLatestFrom(this.store.pipe(select(selectFilterBy))),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(([, filterBy]) =>
        this.shopDbService.query(filterBy).pipe(
          map(products => PRODUCTS_LOADED({ products })),
          catchError(error => {
            console.error('Error loading products:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          })
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  loadFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_FILTER),
      withLatestFrom(this.activatedRoute.queryParamMap),
      mergeMap(([action, queryParams]) => {
        const filterFromParams = this.getInitialFilter(queryParams)
        return [FILTER_UPDATED({ updatedFilter: filterFromParams })]
      })
    )
  )

  private getInitialFilter(queryParams: any): ShopFilter {
    const filterFromParams: ShopFilter = { search: '' }

    if (queryParams.has('search')) {
      filterFromParams.search = queryParams.get('search') || ''
    }
    return filterFromParams
  }

  // handling of product in details
  loadProductByName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_PRODUCT_BY_NAME),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(action =>
        this.shopDbService.getByName(action.name).pipe(
          map(product => {
            console.log('Product loaded:', product)
            return PRODUCT_BY_NAME_LOADED({ product })
          }),
          catchError(error => {
            console.error('Error loading product by name:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          }),
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  saveProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_PRODUCT),
      tap(({ product }) => {
        this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))
        this.shopDbService.save(product).subscribe(
          () => {
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
          },
          (error) => {
            console.error('Error saving product:', error)
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
          }
        )
      })
    ),
    { dispatch: false }
  )

  removeProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REMOVE_PRODUCT),
      switchMap(({ productId }) => {
        return this.shopDbService.remove(productId).pipe(
          switchMap(() => [
            SET_LOADING_STATE({ isLoading: false }),
            PRODUCT_REMOVED_SUCCESSFULLY({ productId })
          ]),
          catchError(error => {
            console.error('Error removing product:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          })
        )
      })
    )
  )

  // handling of random products in details
  loadRandomProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_RANDOM_PRODUCTS),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),
      mergeMap(({ productType, excludeProductId }) =>
        this.shopDbService.getRandomProducts(productType, excludeProductId).pipe(
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
}