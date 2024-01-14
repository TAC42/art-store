import { Injectable } from '@angular/core';
import { HttpService } from './http.service'
import { Product } from '../models/shop'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpService: HttpService) { }

  calculateOrderSummary(cartItems: Product[]): { total: number, taxes: number, deliveryFee: number, grandTotal: number } {
    const nyTaxRate = 0.0875 // NY State tax rate (8.75%)
    const deliveryFeeRate = 0.12 // Delivery fee rate (12%)

    // Calculate total, taxes, and grand total
    const total = cartItems.reduce((acc, cartItem) => acc + cartItem.price, 0)
    const taxes = total * nyTaxRate
    const deliveryFee = total * deliveryFeeRate
    const grandTotal = total + taxes + deliveryFee

    return { total, taxes, deliveryFee, grandTotal }
  }
}
