import { ObjectId } from "mongodb"

export interface Product {
    _id?: ObjectId
    name: string
    imgUrls: string[]
    price: number
    description: string
    dimensions: string
    materials: string
    publishDate: string
    stock: number
    type: string
    createdAt: number
    amount?: number
}

export interface MatchCriteria {
    $match: {
        $or?: Array<{ name: { $regex: RegExp } } |
        { description: { $regex: RegExp } }>
        type?: { $regex: RegExp }
    }
}

export interface ProductQueryParams {
    search?: string
    type?: string
    excludeProductId?: string
}