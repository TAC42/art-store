import { Injectable } from '@angular/core'
import { Observable, throwError, catchError } from 'rxjs'
import { HttpService } from './http.service'
import { Product, ShopFilter } from '../models/shop'

const BASE_URL = 'product/'

@Injectable({
  providedIn: 'root'
})

export class ShopDbService {
  private currentFilter: ShopFilter = this.getDefaultFilter()

  constructor(private httpService: HttpService) { }

  query(filterBy: Partial<ShopFilter> = {}): Observable<any> {
    return this.httpService.get(BASE_URL, filterBy).pipe(
      catchError((error) => {
        console.error('Error querying products:', error)
        return throwError(() => new Error('Error fetching products'))
      })
    )
  }

  getById(productId: string): Observable<any> {
    return this.httpService.get(`${BASE_URL}${productId}`)
  }

  getByName(productName: string): Observable<any> {
    return this.httpService.get(`${BASE_URL}${productName}`)
  }

  getRandomProducts(type: string, excludeProductId: string): Observable<Product[]> {
    const url = `${BASE_URL}random?type=${encodeURIComponent(type)}&excludeProductId=${encodeURIComponent(excludeProductId)}`
    return this.httpService.get<Product[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching random products:', error)
        return throwError(() => new Error('Error fetching random products'));
      })
    )
  }

  remove(productId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}${productId}`)
  }

  save(product: Product): Observable<Product> {
    if (product._id) {
      return this.httpService.put<Product>(`${BASE_URL}${product._id}`, product)
    } else return this.httpService.post<Product>(BASE_URL, product)
  }

  getDefaultFilter(): ShopFilter {
    return {
      search: '',
    }
  }

  static getDefaultProduct(): Product {
    const currentTimestamp = Date.now()

    return {
      name: '',
      imgUrls: ['https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'],
      price: 0,
      description: '',
      inStock: true,
      type: 'shop',
      createdAt: currentTimestamp
    }
  }

  setFilter(filter: ShopFilter): void {
    this.currentFilter = filter
  }

  getCurrentFilter(): ShopFilter {
    return this.currentFilter
  }

  static getDefaultFilterInstance(httpService: HttpService): ShopFilter {
    const service = new ShopDbService(httpService)
    return service.getDefaultFilter()
  }
  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  getFilterFromParams(searchParams: URLSearchParams): ShopFilter {
    const newFilterBy: ShopFilter = this.getDefaultFilter()
    let isNewRefresh = false

    searchParams.forEach((value, key) => {
      if (key in newFilterBy) {
        newFilterBy[key as keyof ShopFilter] = value
        isNewRefresh = true
      }
    })
    if (isNewRefresh) this.setFilter({ ...newFilterBy })

    return newFilterBy
  }
}