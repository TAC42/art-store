import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  EMPTY, Observable, catchError, combineLatest, filter,
  map, of, startWith, switchMap, take, tap
} from 'rxjs'
import { Router } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { User } from '../../models/user'
import { Product } from '../../models/shop'
import { AppState } from '../../store/app.state'
import { selectCart } from '../../store/shop.selectors'
import { SAVE_ORDER } from '../../store/order.actions'
import { CART_LOADED } from '../../store/shop.actions'
import { selectLoggedinUser, selectUser } from '../../store/user.selectors'
import { OrderService } from '../../services/order.service'
import { UtilityService } from '../../services/utility.service'
import { FormUtilsService } from '../../services/form-utils.service'
import { LOAD_USER } from '../../store/user.actions'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})

export class PaymentComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private fb = inject(FormBuilder)
  private formUtilsService = inject(FormUtilsService)
  private utilService = inject(UtilityService)
  private router = inject(Router)
  private store = inject(Store<AppState>)
  private orderService = inject(OrderService)
  private modService = inject(ModalService)

  cart$: Observable<Product[]> = this.store.select(selectCart).pipe(
    filter(cart => !!cart))
  loggedinUser$: Observable<User> = this.store.pipe(select(selectLoggedinUser))
  user$: Observable<User> = this.store.select(selectUser)
  public usStates = this.utilService.getStates()

  optionState: string = 'order'
  payType: string = 'venmo'

  public formUtils = this.formUtilsService
  public paymentForm!: FormGroup
  public personalForm!: FormGroup

  ngOnInit() {
    this.initializeForms()

    this.loggedinUser$.subscribe((user: User) => {
      if (user._id) this.store.dispatch(LOAD_USER({ userId: user._id }))
    })
  }

  initializeForms(): void {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })

    this.user$.subscribe(user => {
      if (user._id) {
        this.personalForm.get('email')?.setValue(user.email)

        const { firstName, lastName } = this.utilService.splitFullName(user.fullName)
        this.personalForm.get('firstName')?.setValue(firstName)
        this.personalForm.get('lastName')?.setValue(lastName)
      }
    })
    this.paymentForm = this.fb.group({
      paymentMethod: ['venmo']
    })
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(value => this.payType = value)
  }

  get orderSummary$(): Observable<{ total: number, taxes: number, deliveryFee: number, grandTotal: number }> {
    return this.cart$.pipe(
      switchMap(cart => {
        console.log('cart status: ', cart)
        if (cart) return of(this.orderService.calculateOrderSummary(cart))
        else return of({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 })
      }),
      startWith({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 }),
      catchError(error => {
        console.error('Error calculating order summary: ', error)
        return of({ total: 0, taxes: 0, deliveryFee: 0, grandTotal: 0 })
      })
    )
  }

  setSelection(option: string) {
    if (this.optionState === option) return
    this.optionState = option
  }

  closePayment() {
    this.router.navigateByUrl('/shop')
    setTimeout(() => this.modService.openModal('cart'), 800)
  }

  // onSubmitPurchase() {
  //   const userData = this.personalForm.value
  //   combineLatest([this.cart$, this.loggedinUser$]).pipe(
  //     take(1),
  //     map(([cart, user]) => {
  //       return {
  //         summary: cart,
  //         user: {
  //           ...userData,
  //           _id: user._id
  //         },
  //         status: 'pending',
  //         payment: this.payType,
  //         createdAt: Date.now()
  //       }
  //     }),
  //     tap(order => {
  //       console.log('this is the order in paymentsubmit: ', order)
  //       this.store.dispatch(SAVE_ORDER({ order }))
  //       this.store.dispatch(CART_LOADED({ cart: [] }))
  //       this.router.navigate(['/profile'])
  //     }),
  //     catchError(error => {
  //       console.error('Error creating order: ', error)
  //       return EMPTY
  //     })
  //   ).subscribe()
  // }
  onSubmitPurchase() {
    const userData = this.personalForm.value;

    combineLatest([this.cart$, this.loggedinUser$]).pipe(
      take(1),
      map(([cart, user]) => {
        // Transform the cart items to include only the specified properties
        const summary = cart.map(({ name, price, _id, amount }) => ({
          name,
          price,
          _id,
          amount
        }));

        return {
          summary, // Use the transformed summary for the order
          user: {
            ...userData,
            _id: user._id
          },
          status: 'pending',
          payment: this.payType,
          createdAt: Date.now()
        };
      }),
      tap(order => {
        console.log('this is the order in paymentsubmit: ', order);
        this.store.dispatch(SAVE_ORDER({ order }));
        this.store.dispatch(CART_LOADED({ cart: [] }));
        this.router.navigate(['/profile']);
      }),
      catchError(error => {
        console.error('Error creating order: ', error);
        return EMPTY;
      })
    ).subscribe();
  }

}