import { ObjectId } from "mongodb"
import { Product } from "./product.js"

export interface Order {
    _id?: ObjectId
    summary: Product[]
    user: OrderUser
    status: string
    payment: string
    createdAt: number
}

export interface FilterBy {
    _id?: string | ObjectId
}

export interface MatchCriteria {
    $match: {
        $or?: Array<{ 'user._id': ObjectId }>
    }
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