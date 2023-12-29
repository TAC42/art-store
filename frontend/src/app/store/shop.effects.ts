import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap } from 'rxjs/operators'
import { ShopDbService } from '../services/shop-db.service'
import { loadProducts, productsLoaded } from './shop.actions'
import { LoaderService } from '../services/loader.service'

@Injectable()
export class ShopEffects {
  constructor(
    private actions$: Actions,
    private shopDbService: ShopDbService,
    private loaderService: LoaderService // Inject the LoaderService
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      tap(() => this.loaderService.setIsLoading(true)), // Start the loader
      mergeMap(({ filterBy }) =>
        this.shopDbService.query(filterBy).pipe(
          map((products) => productsLoaded({ products })),
          tap(() => this.loaderService.setIsLoading(false)) // Stop the loader after products are loaded
        )
      )
    )
  )

  // Other effects for add, update, remove, etc., can be added similarly
}
