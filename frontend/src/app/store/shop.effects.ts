import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap, tap, withLatestFrom } from 'rxjs/operators'
import { ShopDbService } from '../services/shop-db.service'
import { filterUpdated, loadFilter, loadProducts, productsLoaded } from './shop.actions'
import { LoaderService } from '../services/loader.service'
import { Store, select } from '@ngrx/store'
import { AppState } from './app.state'
import { selectFilterBy } from './shop.selectors'
import { ActivatedRoute } from '@angular/router'
import { ShopFilter } from '../models/shop'

@Injectable()
export class ShopEffects {
  constructor(
    private actions$: Actions,
    private shopDbService: ShopDbService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) { }

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

  loadFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilter),
      withLatestFrom(this.activatedRoute.queryParamMap), // Get the current query parameters
      mergeMap(([action, queryParams]) => {
        const filterFromParams = this.getInitialFilter(queryParams)
        return [filterUpdated({ updatedFilter: filterFromParams })]
      })
    )
  )

  private getInitialFilter(queryParams: any): ShopFilter {
    const filterFromParams: ShopFilter = { search: '' }

    if (queryParams.has('search')) {
      filterFromParams.search = queryParams.get('search') || ''
    }
    return filterFromParams;
  }

}

