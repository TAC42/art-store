import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap } from 'rxjs/operators'
import { ShopDbService } from '../services/shop-db.service'
import { loadProducts, productsLoaded } from './shop.actions'

@Injectable()
export class ShopEffects {

    loadProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadProducts),
            mergeMap(({ filterBy }) =>
                this.shopDbService.query(filterBy).pipe( // Pass the filter to your query method
                    map((products) => {
                        console.log('products: ',products)
                       return productsLoaded({ products })
                    }
                    ),
                )
            )
        )
    )

    // Other effects for add, update, remove, etc., can be added similarly

    constructor(private actions$: Actions, private shopDbService: ShopDbService) { }
}
