import { ObjectId } from "mongodb"
import { Cart } from "./product.js"

export interface Order {
    _id?: ObjectId
    summary: Cart[]
    user: OrderUser
    status: string
    payment: string
    expenses: OrderExpenses
    createdAt: number
}

export interface OrderUser {
    _id?: ObjectId
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
}

export interface OrderExpenses {
    total: number
    taxes: number
    deliveryFee: number
    grandTotal: number
}

export interface OrderStatus {
    orderUpdateText: string
    orderUpdateHtml: string
}

export interface OrderInvoice {
    invoiceDate: string
    htmlTable: string
    orderSummaryText: string
    expensesText: string
}

export interface MatchCriteria {
    $match: {
        $or?: Array<{ 'user._id': ObjectId }>
    }
}

export interface OrderQueryParams {
    _id?: string | ObjectId
}