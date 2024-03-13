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
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
    _id?: ObjectId
}

export interface OrderExpenses {
    total: number
    taxes: number
    deliveryFee: number
    grandTotal: number
}

export interface MatchCriteria {
    $match: {
        $or?: Array<{ 'user._id': ObjectId }>
    }
}

export interface OrderQueryParams {
    _id?: string | ObjectId
}