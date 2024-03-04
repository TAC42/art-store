import { Cart, Product } from "./shop"
import { User } from "./user"

export interface Order {
  summary: Product[]
  user: OrderUser
  status: string
  payment: string
  createdAt: number
  _id?: string
}

export interface OrderFilter {
  id?: string
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


