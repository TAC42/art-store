import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { User } from '../../../models/user'
import { ModalService } from '../../../services/modal.service'
import { AppState } from '../../../store/app.state'
import { Store, select } from '@ngrx/store'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { CommunicationService } from '../../../services/communication.service'
import { Product } from '../../../models/shop'
import { OrderService } from '../../../services/order.service'

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  animations: [
    trigger('slideInOut', [
      state('visible', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(100%)'
      })),
      transition('hidden => visible', animate('500ms ease-out')),
      transition('visible => hidden', animate('500ms ease-in'))
    ])
  ]
})
export class CartComponent implements OnInit, OnDestroy {
  public modService = inject(ModalService)
  private store = inject(Store<AppState>)
  private comService = inject(CommunicationService)
  private oService = inject(OrderService)

  private modalSubscription: Subscription | undefined
  cartState: string = 'hidden'
  loggedinUser$: Observable<User> = EMPTY
  cart: Product[] = []

  get orderSummary(): { total: number, taxes: number, deliveryFee: number, grandTotal: number } {
    return this.cart ? this.oService.calculateOrderSummary(this.cart) : { total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 }
  }

  ngOnInit(): void {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))
    this.loggedinUser$.subscribe(user => {
      this.cart = user?.cart || []
      console.log('cart in cart: ', this.cart)
    })
    this.modalSubscription = this.modService.onModalStateChange('cart').subscribe(isOpen => {
      if (isOpen) {
        setTimeout(() => this.cartState = 'visible', 60)
      } else this.cartState = 'hidden'
    })
  }

  closeCart() {
    this.cartState = 'hidden'
    setTimeout(() => {
      this.modService.closeModal('cart')
    }, 600)
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }
}
