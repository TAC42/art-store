import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom, catchError } from 'rxjs/operators'
import { of } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { AppState } from '../app.state'
import { Order } from '../../models/order'
import {
  FILTER_UPDATED, LOAD_FILTER, LOAD_ORDERS, ORDERS_LOADED,
  SAVE_ORDER, SET_LOADING_STATE, REMOVE_ORDER, ORDER_REMOVED_SUCCESSFULLY,
  ORDER_SAVED
} from './order.actions'
import { selectFilterBy } from './order.selectors'
import { OrderService } from '../../services/api/order.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../services/utils/event-bus.service'
import { MailService } from '../../services/api/mail.service'

@Injectable()

export class OrderEffects {
  private actions$ = inject(Actions)
  private orderService = inject(OrderService)
  private eBusService = inject(EventBusService)
  private emailService = inject(MailService)
  private store = inject(Store<AppState>)

  // handling of all orders in dashboard
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_ORDERS),
      withLatestFrom(this.store.pipe(select(selectFilterBy))),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(([{ }, filterBy]) => this.orderService.query(filterBy).pipe(
        map((orders: Order[]) => ORDERS_LOADED({ orders })),
        catchError(error => {
          console.error('Error loading orders:', error)
          return of(SET_LOADING_STATE({ isLoading: false }))
        })
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )

  loadFilter$ = createEffect(() =>
    this.actions$.pipe(ofType(LOAD_FILTER),
      map(({ filterBy }) => { return FILTER_UPDATED({ updatedFilter: filterBy }) })
    )
  )

  // handling of order saving
  saveOrder$ = createEffect(() =>
    this.actions$.pipe(ofType(SAVE_ORDER),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ order }) => this.orderService.save(order).pipe(
        map(() => ORDER_SAVED({ order })),
        tap(() => {
          this.emailService.sendInvoiceMails(order).subscribe()
          showSuccessMsg('Order Sent!',
            `Thank you for the purchase!`, this.eBusService)
        }),
        catchError(error => {
          console.error('Error saving order:', error)
          showErrorMsg('Order Failed!',
            'Please try again, or contact support.', this.eBusService)
          return of(SET_LOADING_STATE({ isLoading: false }))
        }),
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))),
    )
  )

  // handling of order deletion
  removeOrder$ = createEffect(() =>
    this.actions$.pipe(ofType(REMOVE_ORDER),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

      mergeMap(({ orderId }) => this.orderService.remove(orderId).pipe(
        map(() => ORDER_REMOVED_SUCCESSFULLY({ orderId })),
        tap(() => showSuccessMsg('Order Removed!',
          `Order has been removed successfully!`, this.eBusService)),
        catchError(error => {
          console.error('Error removing order:', error)
          showErrorMsg('Failed To Remove!',
            'Whoops, try again later.', this.eBusService)
          return of(SET_LOADING_STATE({ isLoading: false }))
        }),
      )),
      tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
    )
  )
}