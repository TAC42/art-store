import { ChangeDetectorRef, Component, HostBinding, OnInit, inject } from '@angular/core'
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
import { selectLoggedinUser } from '../../store/user.selectors'
import { OrderService } from '../../services/order.service'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})

export class PaymentComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private fb = inject(FormBuilder)
  private utilService = inject(UtilityService)
  private router = inject(Router)
  private store = inject(Store<AppState>)
  private oService = inject(OrderService)
  private changeDetector = inject(ChangeDetectorRef)

  cart$: Observable<Product[]> = this.store.select(selectCart).pipe(
    filter(cart => !!cart))
  usStates = this.utilService.getStates()
  loggedinUser$: Observable<User> = this.store.pipe(select(selectLoggedinUser))

  optionState: string = 'order'
  payType: string = 'venmo'

  paymentForm!: FormGroup
  personalForm!: FormGroup

  constructor() {
    this.paymentForm = this.fb.group({
      paymentMethod: ['venmo']
    })
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(
      value => this.payType = value)
  }

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm(): void {
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
    this.loggedinUser$.subscribe(user => {
      if (user) {
        this.personalForm.get('email')?.setValue(user.email)
      }
    })
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personalForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required`
    if (field?.errors?.['email']) return 'Invalid email format'
    if (field?.errors?.['minLength']) return `${field.errors['minLength'].requiredLength} characters required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`
    if (field?.errors?.['noNumbersAllowed']) return 'Numbers are not allowed'
    if (field?.errors?.['noLettersAllowed']) return 'Letters are not allowed'

    return ''
  }

  setSelection(option: string) {
    if (this.optionState === option) return

    this.optionState = option
    // if (option === 'personal') setTimeout(() => this.nameInput?.nativeElement.focus(), 1000)

    this.changeDetector.detectChanges()
  }

  // onSubmitPurchase() {
  //   console.log('THE ON SUBMIT WORKED!')
  //   const userData = this.personalForm.value

  //   this.cart$.pipe(
  //     tap(cart => console.log('this is the cart: ', cart)),
  //     take(1),
  //     map(cart => ({
  //       summary: cart,
  //       user: {
  //         firstName: userData.first_name,
  //         lastName: userData.last_name,
  //         email: userData.email,
  //         phone: userData.phone,
  //         street: userData.street,
  //         city: userData.city,
  //         state: userData.state,
  //         zip: userData.zip,
  //         _id: this.user?._id
  //       },
  //       status: 'pending',
  //       payment: this.payType,
  //       createdAt: Date.now()
  //     }))
  //   ).subscribe(order => {
  //     console.log('this is the order in paymentsubmit: ', order)

  //     this.store.dispatch(SAVE_ORDER({ order }))
  //     this.store.dispatch(CART_LOADED({ cart: [] }))
  //     this.router.navigate(['/profile'])
  //   })
  // }
  onSubmitPurchase() {
    console.log('THE ON SUBMIT WORKED!')
    const userData = this.personalForm.value

    combineLatest([this.cart$, this.loggedinUser$]).pipe(
      take(1),
      map(([cart, user]) => {
        if (!user) throw new Error('User not logged in')

        return {
          summary: cart,
          user: {
            ...userData,
            _id: user._id
          },
          status: 'pending',
          payment: this.payType,
          createdAt: Date.now()
        }
      }),
      tap(order => {
        console.log('this is the order in paymentsubmit: ', order)
        this.store.dispatch(SAVE_ORDER({ order }))
        this.store.dispatch(CART_LOADED({ cart: [] }))
        this.router.navigate(['/profile'])
      }),
      catchError(error => {
        console.error('Error creating order: ', error)
        return EMPTY
      })
    ).subscribe()
  }
}