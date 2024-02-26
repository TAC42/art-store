export interface Product {
  name: string
  imgUrls: string[]
  price: number
  description: string
  dimensions: string
  materials: string
  publishDate: string
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
  name: string
  url: string
}

export interface CarouselItem {
  type: 'image' | 'product'
  imgUrl: string
  url?: string
  name?: string
}

export interface Cart {
  amount?: number
  _id?: string
}