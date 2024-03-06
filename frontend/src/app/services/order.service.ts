import { Injectable, inject } from '@angular/core'
import { HttpService } from './http.service'
import { Order, OrderFilter } from '../models/order'
import { Observable, catchError, throwError } from 'rxjs'
import { Product } from '../models/shop'

const BASE_URL = 'order/'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private httpService = inject(HttpService)

  query(filterBy: Partial<OrderFilter> = {}): Observable<any> {
    console.log('orderService query filterBy', filterBy)

    return this.httpService.get(BASE_URL, filterBy).pipe(
      catchError((error) => {
        console.error('Error querying orders:', error)
        return throwError(() => new Error('Error fetching orders'))
      })
    )
  }

  getById(orderId: string): Observable<any> {
    return this.httpService.get<Order>(`${BASE_URL}${orderId}`).pipe(
      catchError((error) => {
        console.error('Error fetching order by id:', error)
        return throwError(() => new Error('Error fetching order by id'))
      })
    )
  }

  remove(orderId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}${orderId}`).pipe(
      catchError((error) => {
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

  getDefaultFilter(): OrderFilter {
    return {
      _id: '',
    }
  }

  static getDefaultProduct(): Order {
    const currentTimestamp = Date.now()

    return {
      _id: '',
      summary: [],
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        _id: ''
      },
      status: 'pending',
      payment: '',
      createdAt: currentTimestamp
    }
  }

  calculateOrderSummary(cartItems: Product[]): { total: number, taxes: number, deliveryFee: number, grandTotal: number } {
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
