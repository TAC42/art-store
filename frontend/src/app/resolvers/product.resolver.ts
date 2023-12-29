import { Resolve ,ActivatedRouteSnapshot} from '@angular/router'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { loadProductByName } from '../store/shop.actions'
import { selectProductByName } from '../store/shop.selectors'
import { Observable } from 'rxjs'
import { filter, take, delay, tap, map } from 'rxjs/operators'
import { LoaderService } from '../services/loader.service'
import { Product } from '../models/shop'

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {
  constructor(
    private store: Store<AppState>,
    private loaderService: LoaderService
  ) {}

  resolve(route:ActivatedRouteSnapshot): Observable<Product | null> {
    const name = route.params['name']

    this.loaderService.setIsLoading(true) // Set loading state

    this.store.dispatch(loadProductByName({ name })) // Dispatch action to load product by name
    
    return this.store.select(selectProductByName(name)).pipe(
      filter(product => !!product), // Filter to wait for the product to be available
      delay(500), // Introduce a delay of 500ms
      tap((product) => {
        this.loaderService.setIsLoading(false)
        console.log('product in resolver: ', product)
      }), // Set loading state to false
      map(product => product || null), // Map undefined values to null
      take(1) // Take one emitted value and complete the resolver
    )
  }
}
