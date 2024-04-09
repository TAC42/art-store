import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { Product } from '../../../models/product'
import { ShopFilter } from '../../../models/product'
import { User } from '../../../models/user'
import { FILTER_UPDATED, LOAD_FILTER, LOAD_PRODUCTS, REMOVE_PRODUCT } from '../../../store/product/product.actions'
import { selectProducts, selectIsLoading } from '../../../store/product/product.selectors'
import { selectUser } from '../../../store/user/user.selectors'
import { CommunicationService } from '../../../services/utils/communication.service'
import { ModalService } from '../../../services/utils/modal.service'
import { DeviceTypeService } from '../../../services/utils/device-type.service'

@Component({
  selector: 'artware-index',
  templateUrl: './artware-index.component.html'
})

export class ArtwareIndexComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private modService = inject(ModalService)
  private comService = inject(CommunicationService)
  private dTypeService = inject(DeviceTypeService)

  private removeProductSubscription: Subscription | undefined
  private isLoadingSubscription: Subscription | undefined

  user$: Observable<User> = this.store.select(selectUser)
  deviceType$: Observable<string> = this.dTypeService.deviceType$
  products$: Observable<Product[]> = this.store.select(selectProducts)

  public isShopPage: boolean = false
  public isLoading: boolean = false
  public filterBy: ShopFilter = { search: '', type: 'artware' }

  ngOnInit(): void {
    this.isShopPage = this.router.url.startsWith('/shop')

    this.removeProductSubscription = this.comService.removeProduct$.subscribe(
      productId => this.onRemoveProduct(productId))
    this.isLoadingSubscription = this.store.select(selectIsLoading).subscribe(
      isLoading => this.isLoading = isLoading)

    this.store.dispatch(LOAD_FILTER({ filterBy: this.filterBy }))
    this.store.dispatch(LOAD_PRODUCTS({ filterBy: this.filterBy }))
  }

  onRemoveProductModal(productId: string): void {
    this.modService.openModal(`confirm`, productId)
  }

  onOpenCart(): void {
    this.modService.openModal('cart')
  }

  onRemoveProduct(productId: string) {
    this.store.dispatch(REMOVE_PRODUCT({ productId }))
  }

  onSetFilter(newFilterValue: string): void {
    let updatedFilter: Partial<ShopFilter> = { search: newFilterValue }
    updatedFilter = { ...updatedFilter, type: 'artware' }
    this.updateFilter(updatedFilter)
  }

  private updateFilter(newFilter: Partial<ShopFilter>): void {
    this.store.dispatch(FILTER_UPDATED({ updatedFilter: newFilter }))
    this.store.dispatch({ type: '[Shop] Load Products' })

    this.activatedRoute.queryParams.subscribe(params => {
      const updatedParams = { ...params, search: newFilter.search }
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: updatedParams,
        queryParamsHandling: 'merge',
      })
    })
  }

  ngOnDestroy(): void {
    if (this.removeProductSubscription) this.removeProductSubscription.unsubscribe()
    if (this.isLoadingSubscription) this.isLoadingSubscription.unsubscribe()
  }
}