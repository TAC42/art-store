import { Injectable, inject } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { take, tap, filter, distinctUntilChanged } from 'rxjs/operators'
import { Store, select } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { Product } from '../models/shop'
import { LOAD_PRODUCT_BY_NAME } from '../store/shop.actions'
import { selectProductByName } from '../store/shop.selectors'

@Injectable({
  providedIn: 'root'
})

export class ProductResolver implements Resolve<Product | null> {
  private store = inject(Store<AppState>)

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const name = route.params['name']

    this.store.dispatch(LOAD_PRODUCT_BY_NAME({ name }))

    return this.store.pipe(
      select(selectProductByName),
      filter(product => product !== null && product.name === name),
      distinctUntilChanged((prev, curr) => prev?.name === curr?.name),
      take(1)
    )
  }
}