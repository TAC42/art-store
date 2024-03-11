import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { EMPTY, Observable, Subscription, catchError, filter, of, startWith, switchMap, take } from 'rxjs'
import { User } from '../../../models/user'
import { ModalService } from '../../../services/modal.service'
import { AppState } from '../../../store/app.state'
import { Store } from '@ngrx/store'
import { Cart, Product } from '../../../models/shop'
import { OrderService } from '../../../services/order.service'
import { LOAD_USER, UPDATE_USER } from '../../../store/user.actions'
import { CART_LOADED, LOAD_CART } from '../../../store/shop.actions'
import { selectCart } from '../../../store/shop.selectors'
import { Router } from '@angular/router'
import { selectUser } from '../../../store/user.selectors'

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
  @Input() loggedinUser$!: Observable<User>

  public modService = inject(ModalService)
  private store = inject(Store<AppState>)
  private oService = inject(OrderService)
  private router = inject(Router)

  private modalSubscription: Subscription | undefined
  cartState: string = 'hidden'
  user$: Observable<User> = this.store.select(selectUser)
  cart$: Observable<Product[]> = this.store.select(selectCart)


  ngOnInit(): void {
    this.loggedinUser$.subscribe((user) => {
      if (user._id) {
        this.store.dispatch(LOAD_USER({ userId: user._id }))
      }
  
      if (user.cart.length) {
        this.store.dispatch(LOAD_CART({ userCart: user.cart }))
      } else {
        this.store.dispatch(CART_LOADED({ cart: [] }))
      }
     
    })
  
    this.modalSubscription = this.modService.onModalStateChange('cart').subscribe(
      isOpen => {
        console.log('Modal State Change:', isOpen)
        if (isOpen) setTimeout(() => this.cartState = 'visible', 60)
        else this.cartState = 'hidden'
      }
    )
  }

  get orderSummary$(): Observable<{ total: number, taxes: number, deliveryFee: number, grandTotal: number }> {
    return this.cart$.pipe(
      switchMap(cart => {
        if (cart) {
          // Ensure cart is not null or undefined
          return of(this.oService.calculateOrderSummary(cart))
        } else {
          // Return a default value if cart is null or undefined
          return of({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 })
        }
      }),
      startWith({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 }),
      catchError(error => {
        console.error('Error calculating order summary: ', error)
        // Return a default value in case of an error
        return of({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 })
      })
    )
  }

  closeCart() {
    this.cartState = 'hidden'
    setTimeout(() => this.modService.closeModal('cart'), 600)
  }

  preventCartClosure(event: MouseEvent) {
    event.stopPropagation()
  }

  changeAmount(cartItem: Product, action: string) {
    this.cart$.pipe(take(1)).subscribe(cart => {
      const updatedCartItem = { ...cartItem }

      if (action === '+' && updatedCartItem.amount) {
        if (updatedCartItem.amount !== updatedCartItem.stock) updatedCartItem.amount++
        else return
      } else if (action === '-' && updatedCartItem.amount && updatedCartItem.amount > 1) {
        updatedCartItem.amount--
      } else if (action === '-' && updatedCartItem.amount === 1) {
        const newCart: Cart[] = cart
          .filter(product => product.name !== updatedCartItem.name)
          .map((cartItem) => ({ amount: cartItem.amount, _id: cartItem._id }))
        this.user$.pipe(take(1)).subscribe(updatedUser => {
          console.log('LOGGED IN USER: ', updatedUser)

          const newUser: User = { ...updatedUser, cart: newCart }
          this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
        })
        return
      } else return

      const newCart: Cart[] = cart
        .map(product => (product.name === updatedCartItem.name ? updatedCartItem : product))
        .map((cartItem) => ({ amount: cartItem.amount, _id: cartItem._id }))
      this.user$.pipe(take(1)).subscribe(updatedUser => {
        const newUser: User = { ...updatedUser, cart: newCart }
        this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
      })
    })
  }

  onPayment() {
    this.router.navigate(['/payment'])
    setTimeout(() => this.modService.closeModal('cart'), 600)
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }
}
