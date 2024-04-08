import { Injectable, inject } from '@angular/core'
import { Observable, catchError, map, of, startWith, throwError } from 'rxjs'
import { Order, OrderFilter } from '../models/order'
import { Product } from '../models/shop'
import { User } from '../models/user'
import { HttpService } from './http.service'

const BASE_URL = 'order/'

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private httpService = inject(HttpService)

  query(filterBy: Partial<OrderFilter> = {}): Observable<any> {
    return this.httpService.get(BASE_URL, filterBy).pipe(
      catchError(error => {
        console.error('Error querying orders:', error)
        return throwError(() => new Error('Error fetching orders'))
      })
    )
  }

  getById(orderId: string): Observable<any> {
    return this.httpService.get<Order>(`${BASE_URL}${orderId}`).pipe(
      catchError(error => {
        console.error('Error fetching order by id:', error)
        return throwError(() => new Error('Error fetching order by id'))
      })
    )
  }

  remove(orderId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}${orderId}`).pipe(
      catchError(error => {
        console.error('Error deleting order by id:', error)
        return throwError(() => new Error('Error deleting order by id'))
      })
    )
  }

  save(order: Order): Observable<Order> {
    if (order._id) {
      return this.httpService.put<Order>(`${BASE_URL}${order._id}`, order)
    } else return this.httpService.post<Order>(`${BASE_URL}`, order)
  }

  createPayPalOrder(order: Order): Observable<string> {
    const url = `${BASE_URL}paypal-order`
    return this.httpService.post<string>(url, order).pipe(
      catchError(error => {
        console.error('Error creating PayPal order:', error)
        return throwError(() => new Error('Error creating PayPal order'))
      })
    )
  }
  
  getPaypalClientId(): Observable<string> {
    return this.httpService.get<{ clientId: string }>('paypal-client-id')
      .pipe(
        map(response => response.clientId),
        catchError(error => {
          console.error('Error fetching PayPal client ID:', error)
          return throwError(() => new Error('Error fetching PayPal client ID'))
        })
      )
  }


  getDefaultFilter(): OrderFilter {
    return {
      _id: '',
    }
  }

  createOrder(cart: Product[], user: User, userData: any, payType: string): Order {
    const summary = cart.map(({ name, price, _id, amount }) =>
      ({ name, price, _id, amount }))
    const expenses = this._calculateOrderSummary(cart)

    return {
      summary,
      user: { ...userData, _id: user._id },
      status: 'pending',
      payment: payType,
      expenses,
      createdAt: Date.now()
    }
  }

  getOrderSummary$(cart$: Observable<Product[]>): Observable<{ total: number, taxes: number, deliveryFee: number, grandTotal: number }> {
    return cart$.pipe(
      map(cart => cart ? this._calculateOrderSummary(cart) :
        { total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 }),
      startWith({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 }),
      catchError(error => {
        console.error('Error calculating order summary: ', error);
        return of({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 })
      })
    )
  }

  _calculateOrderSummary(cartItems: Product[]): { total: number, taxes: number, deliveryFee: number, grandTotal: number } {
    const nyTaxRate = 0.0875 // NY State tax rate (8.75%)
    const deliveryFeeRate = 0.12 // Delivery fee rate (12%)

    // Calculate total, taxes, and grand total
    const total = cartItems.reduce((acc, cartItem) => acc + cartItem.price * (cartItem.amount || 1), 0)
    const taxes = total * nyTaxRate
    const deliveryFee = total * deliveryFeeRate
    const grandTotal = total + taxes + deliveryFee

    return { total, taxes, deliveryFee, grandTotal }
  }
}