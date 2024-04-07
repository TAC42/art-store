import { Injectable, inject } from '@angular/core'
import { ValidationErrors } from '@angular/forms'
import { Observable, throwError, catchError, map, of } from 'rxjs'
import { Product, ShopFilter } from '../models/shop'
import { HttpService } from './http.service'

const BASE_URL = 'product/'

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private httpService = inject(HttpService)

  currentFilter: ShopFilter = { search: '' }

  query(filterBy: Partial<ShopFilter> = {}): Observable<any> {
    return this.httpService.get(BASE_URL, filterBy).pipe(
      catchError(error => {
        console.error('Error querying products:', error)
        return throwError(() => new Error('Error fetching products'))
      })
    )
  }

  getById(productId: string): Observable<any> {
    return this.httpService.get<Product>(`${BASE_URL}by-id/${productId}`).pipe(
      catchError(error => {
        console.error('Error fetching product by id:', error)
        return throwError(() => new Error('Error fetching product by id'))
      })
    )
  }

  getByName(productName: string): Observable<Product | null> {
    return this.httpService.get<Product>(`${BASE_URL}by-name/${productName}`).pipe(
      catchError(error => {
        console.error('Error fetching product by name:', error)
        return throwError(() => new Error('Error fetching product by name'))
      })
    )
  }

  getRandomProducts(type: string, excludeProductId: string): Observable<Product[]> {
    const url = `${BASE_URL}query/random?type=${encodeURIComponent(
      type)}&excludeProductId=${encodeURIComponent(excludeProductId)}`
    return this.httpService.get<Product[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching random products:', error)
        return throwError(() => new Error('Error fetching random products'))
      })
    )
  }

  remove(productId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}delete/${productId}`)
  }

  save(product: Product): Observable<Product> {
    if (product._id) {
      return this.httpService.put<Product>(`${BASE_URL}update/${product._id}`, product)
    } else return this.httpService.post<Product>(`${BASE_URL}add`, product)
  }

  validateProductName(productName: string): Observable<ValidationErrors | null> {
    if (!productName) return of(null)

    return this.httpService.get<{ isAvailable: boolean }>(
      `${BASE_URL}check-name/${productName}`).pipe(
        map(response => response.isAvailable ? null : { nameTaken: true }),
        catchError(error => {
          console.error('Error checking name availability:', error)
          return of({ error: 'Network or server error' })
        })
      )
  }

  static getDefaultProduct(): Product {
    const currentTimestamp = Date.now()

    return {
      name: 'something',
      imgUrls: ['https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'],
      price: 0,
      description: 'This is a product / art item, intended for sale / showcase!',
      dimensions: '5 x 5 x 5 inch',
      materials: 'ceramic',
      dateMade: '2024',
      stock: 1,
      type: 'shop',
      createdAt: currentTimestamp
    }
  }

  getFilterFromParams(searchParams: URLSearchParams): ShopFilter {
    const newFilterBy: ShopFilter = { search: '' }
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

  setFilter(filter: ShopFilter): void {
    this.currentFilter = filter
  }
}