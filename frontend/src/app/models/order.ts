import { Cart } from "./shop"
import { User } from "./user"

export interface Order {
  summary: Cart[]
  user: User
  status: string
  payment: string
  createdAt: number
  number: number
  _id?: string
}

export interface OrderFilter {
  id?: string
}


