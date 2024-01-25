import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom, catchError, switchMap } from 'rxjs/operators'
import { EMPTY, of } from 'rxjs'
import { ShopDbService } from '../services/shop-db.service'
import {
  FILTER_UPDATED, LOAD_FILTER, LOAD_PRODUCTS, PRODUCTS_LOADED,
  SAVE_PRODUCT, LOAD_PRODUCT_BY_NAME, SET_LOADING_STATE,
  SET_PRODUCT_BY_NAME, REMOVE_PRODUCT, PRODUCT_REMOVED_SUCCESSFULLY
} from './shop.actions'
import { LoaderService } from '../services/loader.service'
import { Store, select } from '@ngrx/store'
import { AppState } from './app.state'
import { selectFilterBy, selectIsLoading } from './shop.selectors'
import { ActivatedRoute } from '@angular/router'
import { ShopFilter } from '../models/shop'

@Injectable()
export class ShopEffects {
  private actions$ = inject(Actions)
  private shopDbService = inject(ShopDbService)
  private loaderService = inject(LoaderService)
  private activatedRoute = inject(ActivatedRoute)
  private store = inject(Store<AppState>)

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_PRODUCTS),
      withLatestFrom(
        this.store.pipe(select(selectFilterBy)),
        this.store.pipe(select(selectIsLoading))
      ),
      tap(([action, filterBy, isLoading]) => {
        if (!isLoading) {
          this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))
          this.loaderService.setIsLoading(true)
        }
      }),
      mergeMap(([action, filterBy]) =>
        this.shopDbService.query(filterBy).pipe(
          map((products) => PRODUCTS_LOADED({ products })),
          tap(() => {
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
            this.loaderService.setIsLoading(false)
          })
        )
      )
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

  loadProductByName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_PRODUCT_BY_NAME),
      tap(() => {
        this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))
        this.loaderService.setIsLoading(true)
        this.store.dispatch(SET_PRODUCT_BY_NAME({ product: null }))
      }),
      mergeMap(action =>
        this.shopDbService.getByName(action.name).pipe(
          map(product => SET_PRODUCT_BY_NAME({ product })),
          tap(product => console.log('Loaded product:', product.product)),
          tap(() => {
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
            this.loaderService.setIsLoading(false)
          }),
          catchError(error => {
            console.error('Error loading product by name:', error)
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
            this.loaderService.setIsLoading(false)
            return EMPTY
          })
        )
      )
    )
  )

  saveProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_PRODUCT),
      tap(({ product }) => {
        this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))
        this.loaderService.setIsLoading(true)
        this.shopDbService.save(product).subscribe(
          () => {
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
            this.loaderService.setIsLoading(false)
          },
          (error) => {
            console.error('Error saving product:', error)
            this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
            this.loaderService.setIsLoading(false)
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
}


