import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { EMPTY, Observable, Subject, Subscription, combineLatest, forkJoin, map, of, switchMap, take, tap } from 'rxjs'
import { User } from '../../../models/user'
import { ModalService } from '../../../services/modal.service'
import { AppState } from '../../../store/app.state'
import { Store, select } from '@ngrx/store'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { CommunicationService } from '../../../services/communication.service'
import { Product } from '../../../models/shop'
import { OrderService } from '../../../services/order.service'
import { UPDATE_USER } from '../../../store/user.actions'
import { LOAD_PRODUCT_BY_NAME } from '../../../store/shop.actions'
import { selectProductByName } from '../../../store/shop.selectors'

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
  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  private cartRefresh$ = new Subject<void>()
  cart: Product[] = []

  get orderSummary(): { total: number, taxes: number, deliveryFee: number, grandTotal: number } {
    return this.cart ? this.oService.calculateOrderSummary(this.cart) : { total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 }
  }

  ngOnInit(): void {

    // this.loggedinUser$ = this.cartRefresh$.pipe(
    //   switchMap(() => this.store.pipe(select(selectLoggedinUser))),
    //   tap(user => {
    //     console.log('Selected User:', user); // Add this line for debugging
    //   })
    // );


    this.getUserProductObservables().subscribe(() => {
      console.log('cart in cart: ', this.cart);
    });


    this.modalSubscription = this.modService.onModalStateChange('cart').subscribe(isOpen => {
      console.log('Modal State Change:', isOpen)
      if (isOpen) {
        this.cartRefresh$.next()
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

  changeAmount(cartItem: Product, action: string) {
    const updatedCartItem = { ...cartItem }

    if (action === '+' && updatedCartItem.amount) {
      if (updatedCartItem.amount !== updatedCartItem.stock) updatedCartItem.amount++
      else return
    } else if (action === '-' && updatedCartItem.amount && updatedCartItem.amount > 1) {
      updatedCartItem.amount--
    } else if (action === '-' && updatedCartItem.amount === 1) {
      // Remove the cartItem when amount becomes zero
      this.loggedinUser$.pipe(take(1)).subscribe(updatedUser => {
        const newCart: Product[] = this.cart.filter(product => product.name !== updatedCartItem.name)
        const newUser: User = { ...updatedUser, cart: newCart }
        this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
        // this.cartRefresh$.next()
      })
      return
    } else {
      return
    }

    // Update the user's cart for any other changes
    this.loggedinUser$.pipe(take(1)).subscribe(updatedUser => {
      const newCart: Product[] = this.cart.map(product => (product.name === updatedCartItem.name ? updatedCartItem : product))
      const newUser: User = { ...updatedUser, cart: newCart }
      this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
      // this.cartRefresh$.next()
    })
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }

  private getUserProductObservables() {
    return this.cartRefresh$.pipe(
      switchMap(() =>
        this.loggedinUser$.pipe(
          take(1),
          switchMap(user => {
            console.log('User in getUserProductObservables:', user)
            const productObservables = user.cart.map(cartItem => {
              this.store.dispatch(LOAD_PRODUCT_BY_NAME({ name: cartItem.name }))
              return this.store.pipe(
                select(selectProductByName),
                map(product => ({ ...product, amount: cartItem.amount || 0 } as Product)),
                take(1) 
              )
            })

            return forkJoin(productObservables).pipe(
              tap(products => {
                this.cart = products
                console.log('Cart in getUserProductObservables:', this.cart)
              })
            )
          })
        )
      )
    )
  }
}
