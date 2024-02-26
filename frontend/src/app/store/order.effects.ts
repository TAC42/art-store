import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom, catchError, switchMap, toArray, filter, take } from 'rxjs/operators'
import { of } from 'rxjs'
import { OrderService } from '../services/order.service'
import {
  FILTER_UPDATED, LOAD_FILTER, LOAD_ORDERS, ORDERS_LOADED,
  SAVE_ORDER, SET_LOADING_STATE, REMOVE_ORDER, ORDER_REMOVED_SUCCESSFULLY,
  ORDER_SAVED
} from './order.actions'
import { Store, select } from '@ngrx/store'
import { AppState } from './app.state'
import { selectFilterBy, selectOrders } from './order.selectors'
import { ActivatedRoute } from '@angular/router'

@Injectable()
export class ShopEffects {
  private actions$ = inject(Actions)
  private orderService = inject(OrderService)
  private activatedRoute = inject(ActivatedRoute)
  private store = inject(Store<AppState>)

  // handling of all orders in dashboard
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_ORDERS),
      withLatestFrom(this.store.pipe(select(selectFilterBy))),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(([, filterBy]) =>
        this.orderService.query(filterBy).pipe(
          map(orders => ORDERS_LOADED({ orders })),
          catchError(error => {
            console.error('Error loading orders:', error)
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
      map((action) => {
        const filterBy = action.filterBy
        return FILTER_UPDATED({ updatedFilter: filterBy })
      })
    )
  )

  // handling of order saving
  saveOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_ORDER),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ order }) =>
        this.orderService.save(order).pipe(
          map(() => ORDER_SAVED({ order })),
          catchError(error => {
            console.error('Error saving order:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          }),
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))),
    )
  )

  // handling of order deletion
  removeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REMOVE_ORDER),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ orderId }) =>
        this.orderService.remove(orderId).pipe(
          map(() => ORDER_REMOVED_SUCCESSFULLY({ orderId })),
          catchError(error => {
            console.error('Error removing order:', error)
            return of(SET_LOADING_STATE({ isLoading: false }))
          }),
        )
      ),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )


}
