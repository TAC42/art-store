import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { LOAD_PRODUCT_BY_NAME } from '../store/shop.actions'
import { selectProductByName } from '../store/shop.selectors'
import { Observable } from 'rxjs'
import { take, tap, filter, map } from 'rxjs/operators'
import { Product } from '../models/shop'

@Injectable({
  providedIn: 'root'
})

export class ProductResolver implements Resolve<Product | null> {
  private store = inject(Store<AppState>)

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const name = route.params['name']

    this.store.dispatch(LOAD_PRODUCT_BY_NAME({ name }))

    return this.store.select(selectProductByName).pipe(
      filter((product): product is Product => !!product),
      tap((product) => console.log('product in resolver: ', product)),
      map((product) => product || null),
      take(1)
    )
  }
}