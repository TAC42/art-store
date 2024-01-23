export interface Product {
  name: string
  imgUrls: string[]
  price: number
  description: string
  stock: number
  type: string
  createdAt: number
  amount?: number
  _id?: string
}

export interface ShopFilter {
  search?: string
  type?: string
}

export interface MiniProduct {
  imgUrl: string
  productName: string
  url: string
}