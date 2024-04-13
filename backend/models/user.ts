import { ObjectId } from "mongodb"

export interface LoginRequestBody {
    loginId: string
    password: string
    recaptchaToken: string
}

export interface SignupRequestBody {
    username: string
    password: string
    fullName: string
    email: string
    imgUrls?: string[]
    recaptchaToken: string
}

export interface User {
    _id?: ObjectId
    username?: string
    password?: string
    fullName?: string
    email?: string
    imgUrls?: string[]
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