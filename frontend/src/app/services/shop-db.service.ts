import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { httpService } from './http.service';
import { Product, ShopFilter } from '../models/shop';

const BASE_URL = 'product/';

@Injectable({
  providedIn: 'root'
})
export class ShopDbService {

  constructor(private httpService: HttpService) { }


  query(filterBy: Partial<ShopFilter> = {}): Observable<any> {
    return this.httpService.get(BASE_URL, filterBy).pipe(
      catchError((error) => {
        console.error('Error querying products:', error);
        return throwError(error);
      })
    );
  }

  getById(productId: string): Observable<any> {
    return this.httpService.get(`${BASE_URL}${productId}`);
  }

  remove(productId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}${productId}`);
  }

  save(product: Product): Observable<Product> {
    const savedGig = product._id
      ? this.httpService.put(`${BASE_URL}${product._id}`, product)
      : this.httpService.post(BASE_URL, product);
    return savedGig;
  }

  getDefaultFilter(): ShopFilter {
    return {
      search: '',
    }
  }

  setFilter(filter: any) {
    this.setFilter(filter);
  }

  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getFilterFromParams(searchParams: URLSearchParams): ShopFilter {
    const newFilterBy: ShopFilter = this.getDefaultFilter();
    let isNewRefresh = false;

    for (const [key, value] of searchParams) {
      newFilterBy[key as keyof ShopFilter] = value;
      if (newFilterBy[key as keyof ShopFilter]) isNewRefresh = true;
    }

    if (isNewRefresh) this.setFilter({ ...newFilterBy });

    return newFilterBy;
  }
}
