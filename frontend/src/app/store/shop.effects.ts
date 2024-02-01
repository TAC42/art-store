import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom, catchError, switchMap, toArray, filter, take } from 'rxjs/operators'
import { forkJoin, from, of } from 'rxjs'
import { ShopDbService } from '../services/shop-db.service'
import {
  FILTER_UPDATED, LOAD_FILTER, LOAD_PRODUCTS, PRODUCTS_LOADED,
  SAVE_PRODUCT, LOAD_PRODUCT_BY_NAME, SET_LOADING_STATE,
  PRODUCT_BY_NAME_LOADED, REMOVE_PRODUCT, PRODUCT_REMOVED_SUCCESSFULLY,
  LOAD_RANDOM_PRODUCTS, RANDOM_PRODUCTS_LOADED, PRODUCT_SAVED, LOAD_CART, CART_LOADED
} from './shop.actions'
import { Store, select } from '@ngrx/store'
import { AppState } from './app.state'
import { selectFilterBy, selectProducts } from './shop.selectors'
import { ActivatedRoute } from '@angular/router'
import { Cart, Product, ShopFilter } from '../models/shop'

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

  // handling of product saving
  saveProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_PRODUCT),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ product }) =>
        this.shopDbService.save(product).pipe(
          map(() => PRODUCT_SAVED({ product })),
          catchError(error => {
            console.error('Error saving product:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          }),
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))),
    )
  )

  // handling of product deletion
  removeProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REMOVE_PRODUCT),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ productId }) =>
        this.shopDbService.remove(productId).pipe(
          map(() => PRODUCT_REMOVED_SUCCESSFULLY({ productId })),
          catchError(error => {
            console.error('Error removing product:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          }),
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
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



  // loadCart$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(LOAD_CART),
  //     tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

  //     mergeMap(({ userCart }) => {
  //       const requests = userCart.map(cartItem => {
  //         if (cartItem.name) {  // Add a check for undefined name
  //           console.log('in LOAD_CART_EFFECT: ', cartItem);
  //           return this.shopDbService.getByName(cartItem.name).pipe(
  //             take(1),
  //             map((product) => ({ ...product, amount: cartItem.amount })),
  //             catchError(() => of({ error: true } as const))
  //           );
  //         } else {
  //           console.error('Product name is undefined for cart item:', cartItem);
  //           return of({ error: true } as const);
  //         }
  //       });

  //       return forkJoin(requests).pipe(
  //         mergeMap((results) => {
  //           const validProducts: Product[] = results
  //             .map(result => result as Product)

  //           return of(CART_LOADED({ cart: validProducts }))
  //         }),
  //         catchError((error) => {
  //           console.error('Error loading cart: ', error)
  //           return of(SET_LOADING_STATE({ isLoading: false }))
  //         })
  //       )
  //     }),
  //     tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
  //   )
  // )

  loadCart$ = createEffect(() =>
  this.actions$.pipe(
    ofType(LOAD_CART),
    tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

    mergeMap(({ userCart }) => {
      return this.store.pipe(
        select(selectProducts),
        take(1),
        mergeMap((products) => {
          // Filter the products based on the names in userCart
          const cartProducts: Product[] = userCart
            .filter(cartItem => !!cartItem.name)
            .map(cartItem => {
              const foundProduct = products.find(product => product.name === cartItem.name)
              return foundProduct ? { ...foundProduct, amount: cartItem.amount } : null
            })
            .filter(product => !!product) as Product[]

          return of(CART_LOADED({ cart: cartProducts }))
        }),
        catchError((error) => {
          console.error('Error loading cart from store: ', error)
          return of(SET_LOADING_STATE({ isLoading: false }))
        })
      )
    }),
    tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
  )
)


}

