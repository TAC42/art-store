import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { selectProducts, selectIsLoading } from '../../store/shop.selectors'
import { Product } from '../../models/shop'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { ActivatedRoute, Router } from '@angular/router'
import { ShopFilter } from '../../models/shop'
import { filterUpdated } from '../../store/shop.actions'

@Component({
  selector: 'shop-index',
  templateUrl: './shop-index.component.html'
})
export class ShopIndexComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) { }
  router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  products$: Observable<Product[]> = this.store.select(selectProducts)
  isLoading: boolean = false
  filterBy: ShopFilter = { search: '' }


  ngOnInit(): void {
    this.store.select(selectIsLoading).subscribe((isLoading: boolean) => {
      this.isLoading = isLoading
    })

    this.store.dispatch({ type: '[Shop] Load Filter' })
    this.store.dispatch({ type: '[Shop] Load Products' })
  }

  onRemoveProduct(productId: string): void {
    // const removeSubscription = this.shopDbService.remove(productId).subscribe({
    //   next: () => this.loadProducts(),
    //   error: err => console.error('Error removing product:', err)
    // })
    // this.subscription.add(removeSubscription)
  }

  onSetFilter(newFilterValue: string): void {
    const updatedFilter: Partial<ShopFilter> = { search: newFilterValue }
    this.updateFilter(updatedFilter)
  }

  private updateFilter(newFilter: Partial<ShopFilter>): void {
    this.store.dispatch(filterUpdated({ updatedFilter: newFilter }))
    this.store.dispatch({ type: '[Shop] Load Products' })

    // Update route parameters with search filter
    this.activatedRoute.queryParams.subscribe((params) => {
      const updatedParams = { ...params, search: newFilter.search }
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: updatedParams,
        queryParamsHandling: 'merge',
      })
    })

  }

  ngOnDestroy(): void {

  }
}