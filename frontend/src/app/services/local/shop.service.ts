import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, catchError, from, retry, tap, throwError } from 'rxjs'
import { Product, ProductFilter } from '../../models/product'
import { storageService } from './async-storage.service'
import { HttpErrorResponse } from '@angular/common/http'
const ENTITY = 'products'

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private _products$ = new BehaviorSubject<Product[]>([])
  public products$ = this._products$.asObservable()

  private _filterBy$ = new BehaviorSubject<ProductFilter>({ search: '' })
  public filterBy$ = this._filterBy$.asObservable()

  constructor() {
    // Handling Demo Data, fetching from storage || saving to storage 
    const products = JSON.parse(localStorage.getItem(ENTITY) || 'null')
    if (!products || products.length === 0) {
      localStorage.setItem(ENTITY, JSON.stringify(this._createProducts()))
    }
  }

  public loadProducts() {
    return from(storageService.query<Product>(ENTITY))
      .pipe(
        tap(products => {
          const filterBy = this._filterBy$.value
          if (filterBy && filterBy.search) {
            products = this._filter(products, filterBy.search)
          }
          products = products.filter(product => product.name.toLowerCase().includes(filterBy.search.toLowerCase()))
          this._products$.next(this._sort(products))
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  public getProductById(id: string): Observable<Product> {
    return from(storageService.get<Product>(ENTITY, id))
      .pipe(catchError(err => throwError(() => `Contact id ${id} not found! ${err}`)))
  }

  public deleteProduct(id: string) {
    return from(storageService.remove(ENTITY, id))
      .pipe(
        tap(() => {
          let products = this._products$.value
          products = products.filter(product => product._id !== id)
          this._products$.next(products)
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  public saveProduct(product: Product) {
    return product._id ? this._updateContact(product) : this._addContact(product)
  }

  public getEmptyProduct() {
    return {
      name: '',
      imgUrl: '',
      price: 0,
      description: '',
      inStock: false,
      createdAt: 0,
    }
  }

  private _updateContact(product: Product) {
    return from(storageService.put<Product>(ENTITY, product))
      .pipe(
        tap(updatedProduct => {
          const contacts = this._products$.value
          this._products$.next(contacts.map(contact => contact._id === updatedProduct._id ? updatedProduct : contact))
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  private _addContact(product: Product) {
    return from(storageService.post(ENTITY, product))
      .pipe(
        tap(newProduct => {
          const products = this._products$.value
          this._products$.next([...products, newProduct])
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  private _sort(products: Product[]): Product[] {
    return products.sort((a, b) => {
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1
      }
      if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1
      }
      return 0
    })
  }

  public setFilterBy(filterBy: ProductFilter) {
    this._filterBy$.next(filterBy)
    this.loadProducts().pipe().subscribe()
  }

  private _filter(products: Product[], search: string) {
    search = search.toLocaleLowerCase()
    return products.filter(product => {
      return product.name.toLocaleLowerCase().includes(search) ||
        product.description.toLocaleLowerCase().includes(search)
    })
  }

  private _createProducts() {
    const products = [
      {
        "_id": "5a56640269f443a5d64b32ca",
        "name": "Pot1",
        "imgUrl":"",
        "description": "blah blah blah blah blah blah",
        "price": 99,
        "inStock": true,
        "createdAt": "1234567891234"
      },
      {
        "_id": "5a5664025f6ae9aa24a99fde",
        "name": "Pot2",
        "imgUrl":"",
        "description": "blah blah blah blah blah blah",
        "price": 49,
        "inStock": true,
        "createdAt": "1234567891235"
      },
    ]
    return products
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('err:', err)
    return throwError(() => err)
  }
}

function _getRandomId(length = 8): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      characters.length))
  }
  return result
}