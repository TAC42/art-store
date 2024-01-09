import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { LOAD_PRODUCT_BY_NAME } from '../store/shop.actions'
import { selectProductByName } from '../store/shop.selectors'
import { Observable, of } from 'rxjs'
import { take, tap, switchMap } from 'rxjs/operators'
import { LoaderService } from '../services/loader.service'
import { Product } from '../models/shop'

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {
  constructor(
    private store: Store<AppState>,
    private lService: LoaderService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const name = route.params['name']

    this.lService.setIsLoading(true)
    this.store.dispatch(LOAD_PRODUCT_BY_NAME({ name }))

    return this.store.select(selectProductByName(name)).pipe(
      switchMap(product => {
        if (product) {
          console.log('Product resolved:', product)
          return of(product)
        }
        else return of(null)
      }),
      tap(() => this.lService.setIsLoading(false)),
      take(1)
    )
  }
}