import { Cart } from "./product"

export interface Order {
  _id?: string
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
  _id: string
}

export interface OrderExpenses {
  total: number
  taxes: number
  deliveryFee: number
  grandTotal: number
}

export interface OrderFilter {
  _id?: string
}