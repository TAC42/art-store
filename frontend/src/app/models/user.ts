import { Product } from "./shop"

export interface User {
    _id?: string
    fullName: string
    email: string
    imgUrl: string
    username: string
    password: string
    createdAt: number
    isAdmin: boolean
    cart?: Product[]
}

export interface UserCredentials {
    username: string
    password: string
}

export interface UserSignup {
    fullName: string
    username: string
    email: string
    imgUrl: string
    password: string
}