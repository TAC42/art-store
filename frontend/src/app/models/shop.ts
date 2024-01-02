export interface Product {
  name: string
  imgUrl: string
  price: number
  description: string
  inStock: boolean
  type: string
  createdAt: number
  _id?: string
}

export interface ShopFilter {
  search: string
}
