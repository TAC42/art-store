import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { EMPTY, Observable, Subject, Subscription, catchError, combineLatest, concatMap, filter, forkJoin, map, of, startWith, switchMap, take, tap } from 'rxjs'
import { User } from '../../../models/user'
import { ModalService } from '../../../services/modal.service'
import { AppState } from '../../../store/app.state'
import { Store, select } from '@ngrx/store'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { CommunicationService } from '../../../services/communication.service'
import { Cart, Product } from '../../../models/shop'
import { OrderService } from '../../../services/order.service'
import { UPDATE_USER } from '../../../store/user.actions'
import { LOAD_CART, LOAD_PRODUCT_BY_NAME } from '../../../store/shop.actions'
import { selectCart, selectProductByName } from '../../../store/shop.selectors'


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
  cart$: Observable<Product[]> = this.store.select(selectCart).pipe(
    filter(cart => !!cart) // Ensure cart is not null or undefined
  )

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
    );
  }

  ngOnInit(): void {
    this.loggedinUser$.subscribe((user) => {
      // const userCart = user.cart.map((cartItem) => ({
      //   name: cartItem.name,
      //   amount: cartItem.amount
      // } as Cart));
      
      console.log('User in NGONINIT: ',user);
      
      // Load and update the product details in the cart asynchronously
      if(user.cart.length){
        this.store.dispatch(LOAD_CART({ userCart: user.cart }))
        this.cartRefresh$.next()
      }
    })
    


    this.modalSubscription = this.modService.onModalStateChange('cart').subscribe(isOpen => {
      console.log('Modal State Change:', isOpen)
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

  changeAmount(cartItem: Product, action: string) {
    this.cart$.pipe(take(1)).subscribe(cart => {
      const updatedCartItem = { ...cartItem }
  
      if (action === '+' && updatedCartItem.amount) {
        if (updatedCartItem.amount !== updatedCartItem.stock) updatedCartItem.amount++
        else return
      } else if (action === '-' && updatedCartItem.amount && updatedCartItem.amount > 1) {
        updatedCartItem.amount--
      } else if (action === '-' && updatedCartItem.amount === 1) {
        // Remove the cartItem when amount becomes zero
        const newCart: Product[] = cart.filter(product => product.name !== updatedCartItem.name)
        this.loggedinUser$.pipe(take(1)).subscribe(updatedUser => {
          const newUser: User = { ...updatedUser, cart: newCart }
          this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
        })
        return
      } else {
        return
      }
  
      // Update the user's cart for any other changes
      const newCart: Product[] = cart.map(product => (product.name === updatedCartItem.name ? updatedCartItem : product))
      this.loggedinUser$.pipe(take(1)).subscribe(updatedUser => {
        const newUser: User = { ...updatedUser, cart: newCart }
        this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
      })
    })
  }
  

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }


  // private loadProductDetails(userCart: Product[]) {
  //   const observables: Observable<Product | null>[] = [];
  
  //   // Iterate through each cart item and create an observable for each product loading
  //   userCart.forEach(cartItem => {
  //     const combinedObservable = of(null).pipe(
  //       switchMap(() => {
  //         // Dispatch the action to load the product by name
  //         this.store.dispatch(LOAD_PRODUCT_BY_NAME({ name: cartItem.name }));
  
  //         // Retrieve the product by name from the store
  //         return this.store.select(selectProductByName).pipe(
  //           // Take only one value (the loaded product)
  //           take(1),
  //           // Map the loaded product to the cart item structure
  //           map((loadedProduct: Product | null) => loadedProduct ? { ...loadedProduct, amount: cartItem.amount } : null),
  //           // Use catchError to handle errors and return EMPTY in case of null product
  //           catchError(() => EMPTY)
  //         ); 
  //       })
  //     );
  
  //     // Add the combined observable to the array
  //     observables.push(combinedObservable);
  //   });
  
  //   // Use forkJoin to wait for all observables to complete
  //   forkJoin(observables).subscribe(updatedCart => {
  //     // Update the cart with the loaded product details
  //     this.cart = updatedCart as Product []
  
  //     // Trigger a refresh for the UI or any other actions you need to perform
  //     this.cartRefresh$.next();
  //   });
  // }
  




}
