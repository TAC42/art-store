import { Cart } from "./product"

export interface User {
    _id?: string
    fullName: string
    email: string
    imgUrls: string[]
    username: string
    password: string
    createdAt: number
    isAdmin: boolean
    cart: Cart[]
    isVerified: boolean
}

export interface UserLogin {
    loginId: string
    password: string,
    recaptchaToken: string | null
}

export interface UserSignup {
    fullName: string
    username: string
    email: string
    imgUrls: string[]
    password: string,
    recaptchaToken: string | null
}