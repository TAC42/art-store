export interface Product {
  _id?: string
  name: string
  imgUrls: string[]
  price: number
  description: string
  dimensions: string
  materials: string
  dateMade: string
  stock: number
  type: string
  createdAt: number
  amount?: number
}

export interface MiniProduct {
  imgUrl: string
  lowResImgUrl?: string
  name: string
  url: string
}

export interface ProductFilter {
  search?: string
  type?: string
}

export interface Cart {
  _id?: string
  name?: string
  price?: number
  amount?: number
}