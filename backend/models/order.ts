import { ObjectId } from "mongodb"
import { Product } from "./product.js"

export interface Order {
    _id?: string
    summary: Product[]
    user: OrderUser
    status: string
    payment: string
    createdAt: number
}

export interface FilterBy {
    id?: string
}

export interface MatchCriteria {
    $match: {
        $or?: Array<{ 'user._id': ObjectId }>
    }
}

export interface OrderUser {
    first_name: string
    last_name: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
    _id?: string
}