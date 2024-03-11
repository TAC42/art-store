import { Product } from "./shop"

export interface Order {
  _id?: string
  summary: Product[]
  user: OrderUser
  status: string
  payment: string
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
  _id: string
}

export interface OrderFilter {
  _id?: string
}