import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EMPTY, Observable, catchError, combineLatest, filter, from, mergeMap, of, take, tap } from 'rxjs'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { User } from '../../models/user'
import { Product } from '../../models/shop'
import { AppState } from '../../store/app.state'
import { selectCart } from '../../store/shop.selectors'
import { selectUser } from '../../store/user.selectors'
import { SAVE_ORDER } from '../../store/order.actions'
import { CART_LOADED } from '../../store/shop.actions'
import { UPDATE_USER } from '../../store/user.actions'
import { OrderService } from '../../services/order.service'
import { UtilityService } from '../../services/utility.service'
import { FormUtilsService } from '../../services/form-utils.service'


@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})

export class PaymentComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private fb = inject(FormBuilder)
  private formUtilsService = inject(FormUtilsService)
  private utilService = inject(UtilityService)
  private router = inject(Router)
  private store = inject(Store<AppState>)
  private orderService = inject(OrderService)

  cart$: Observable<Product[]> = this.store.select(selectCart).pipe(
    filter(cart => !!cart))
  user$: Observable<User> = this.store.select(selectUser)
  orderSummary$!: Observable<{ total: number, taxes: number, deliveryFee: number, grandTotal: number }>

  public usStates = this.utilService.getStates()
  optionState: string = 'order'
  payType: string = 'venmo'

  public formUtils = this.formUtilsService
  public paymentForm!: FormGroup
  public personalForm!: FormGroup

  ngOnInit() {
    this.initializeForms()
    this.orderSummary$ = this.orderService.getOrderSummary$(this.cart$)

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
    this.paymentForm = this.fb.group({ paymentMethod: ['venmo'] })
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(value => this.payType = value)
  }

  setSelection(option: string): void {
    this.optionState === option || (this.optionState = option)
  }

  onSubmitPurchase(): void {
    const userData = this.personalForm.value

    combineLatest([this.cart$, this.user$]).pipe(
      take(1),
      mergeMap(([cart, user]) => {
        const order = this.orderService.createOrder(cart, user, userData, this.payType)
        return of(order).pipe(
          tap(order => this.store.dispatch(SAVE_ORDER({ order }))),
          tap(() => {
            this.store.dispatch(CART_LOADED({ cart: [] }))
            const updatedUser: User = { ...user, cart: [] }
            this.store.dispatch(UPDATE_USER({ updatedUser }))

            setTimeout(() => this.router.navigate(['/profile']), 3000)
          }),
          catchError(error => {
            console.error('Error creating order: ', error)
            return EMPTY
          })
        )
      })
    ).subscribe()
  }


}