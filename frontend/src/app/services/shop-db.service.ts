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
    console.log('filterBy in Query ',filterBy)
    return this.httpService.get(BASE_URL, filterBy).pipe(
      catchError((error) => {
        console.error('Error querying products:', error)
        return throwError(error)
      })
    )
  }

  getById(productId: string): Observable<any> {
    return this.httpService.get(`${BASE_URL}${productId}`)
  }

  remove(productId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}${productId}`)
  }

  save(product: Product): Observable<Product> {
    if (product) {
      return this.httpService.put<Product>(`${BASE_URL}${product._id}`, product)
    } else return this.httpService.post<Product>(BASE_URL, product)
  }

  getDefaultFilter(): ShopFilter {
    return {
      search: '',
    }
  }

  setFilter(filter: ShopFilter): void {
    this.currentFilter = filter
    // Optionally, trigger a new fetch here if that's the intended behavior
    // For example, you might emit a new value on an Observable that 
    // ShopComponent is subscribed to
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

// getFilterFromParams(searchParams: URLSearchParams): ShopFilter {
//   const newFilterBy: ShopFilter = this.getDefaultFilter()
//   let isNewRefresh = false

//   for (const [key, value] of searchParams) {
//     newFilterBy[key as keyof ShopFilter] = value;
//     if (newFilterBy[key as keyof ShopFilter]) isNewRefresh = true
//   }

//   if (isNewRefresh) this.setFilter({ ...newFilterBy })

//   return newFilterBy
// }
