import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Observable, take } from 'rxjs'
import { selectProducts, selectIsLoading } from '../../../store/shop.selectors'
import { Cart, Product } from '../../../models/shop'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { ActivatedRoute, Router } from '@angular/router'
import { ShopFilter } from '../../../models/shop'
import { FILTER_UPDATED, LOAD_FILTER, LOAD_PRODUCTS, REMOVE_PRODUCT } from '../../../store/shop.actions'
import { CommunicationService } from '../../../services/communication.service'
import { ModalService } from '../../../services/modal.service'
import { UPDATE_USER } from '../../../store/user.actions'
import { User } from '../../../models/user'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'

@Component({
  selector: 'shop-index',
  templateUrl: './shop-index.component.html'
})

export class ShopIndexComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private modService = inject(ModalService)
  private comService = inject(CommunicationService)
  private eBusService = inject(EventBusService)

  products$: Observable<Product[]> = this.store.select(selectProducts)
  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  isLoading: boolean = false
  filterBy: ShopFilter = { search: '', type: 'shop' }
  backgroundImage: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1705581236/u5qpc2zretuthgb3n5ox.png'

  ngOnInit(): void {
    this.comService.removeProduct$.subscribe(
      (productId: string) => { this.onRemoveProduct(productId) })

    this.store.dispatch(LOAD_FILTER({ filterBy: this.filterBy }))
    this.store.dispatch(LOAD_PRODUCTS({ filterBy: this.filterBy }))

    this.store.select(selectIsLoading).subscribe(
      (isLoading: boolean) => { this.isLoading = isLoading })
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

  onAddToCart(product: Product) {
    this.loggedinUser$.pipe(take(1)).subscribe(
      updatedUser => {
        if (updatedUser._id) {
          const newCartItem: Cart = { _id: product._id, amount: 1 }

          const isProductAlreadyInCart = updatedUser.cart.some(
            cartProduct => cartProduct._id === newCartItem._id)

          if (!isProductAlreadyInCart) {
            const newUser: User = {
              ...updatedUser,
              cart: [...updatedUser.cart, newCartItem]
            }
            this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
            showSuccessMsg('Product Added!',
              'Product has been added to the cart', this.eBusService)
          } else showErrorMsg('Cannot Add!',
            'Product already included in the cart', this.eBusService)
        } else this.modService.openModal('login')
      })
  }

  onSetFilter(newFilterValue: string): void {
    let updatedFilter: Partial<ShopFilter> = { search: newFilterValue }
    updatedFilter = { ...updatedFilter, type: 'shop' }
    this.updateFilter(updatedFilter)
  }

  private updateFilter(newFilter: Partial<ShopFilter>): void {
    this.store.dispatch(FILTER_UPDATED({ updatedFilter: newFilter }))
    this.store.dispatch({ type: '[Shop] Load Products' })

    this.activatedRoute.queryParams.subscribe(
      (params) => {
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