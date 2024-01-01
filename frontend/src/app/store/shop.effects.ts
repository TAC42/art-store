import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom } from 'rxjs/operators'
import { ShopDbService } from '../services/shop-db.service'
import { loadProducts, productsLoaded } from './shop.actions'
import { LoaderService } from '../services/loader.service'
import { Store, select } from '@ngrx/store'
import { AppState } from './app.state'
import { selectFilterBy } from './shop.selectors'

@Injectable()
export class ShopEffects {
  constructor(
    private actions$: Actions,
    private shopDbService: ShopDbService,
    private loaderService: LoaderService, // Inject the LoaderService
    private store: Store<AppState>
  ) {}

  loadProducts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadProducts),
    withLatestFrom(this.store.pipe(select(selectFilterBy))),
    tap(() => this.loaderService.setIsLoading(true)), // Start the loader
    mergeMap(([action, filterBy]) =>
      this.shopDbService.query(filterBy).pipe(
        map((products) => productsLoaded({ products })),
        tap(() => this.loaderService.setIsLoading(false)) // Stop the loader after products are loaded
      )
    )
  )
)
  // Other effects for add, update, remove, etc., can be added similarly
}
