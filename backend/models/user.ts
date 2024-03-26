import { ObjectId } from "mongodb"

export interface LoginRequestBody {
    username: string
    password: string
    recaptchaToken: string
}

export interface SignupRequestBody extends LoginRequestBody {
    fullName: string
    email: string
    imgUrl?: string
}

export interface User {
    _id?: ObjectId
    username?: string
    password?: string
    fullName?: string
    email?: string
    imgUrl?: string[]
    cart?: any[]
    createdAt?: number
    isAdmin?: boolean
    isVerified?: boolean
}

export interface UserQueryParams {
    userId?: string
    username?: string
    fullName?: string
    isVerified?: boolean
}