import { ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilityService } from '../../services/utility.service'
import { Observable, Subscription, catchError, filter, map, of, startWith, switchMap } from 'rxjs'
import { User } from '../../models/user'
import { ActivatedRoute } from '@angular/router'
import { Product } from '../../models/shop'
import { AppState } from '../../store/app.state'
import { Store } from '@ngrx/store'
import { selectCart } from '../../store/shop.selectors'
import { OrderService } from '../../services/order.service'

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true
  @ViewChild('nameInput') nameInput!: ElementRef

  private fb = inject(FormBuilder)
  private utilService = inject(UtilityService)
  private route = inject(ActivatedRoute)
  private store = inject(Store<AppState>)
  private oService = inject(OrderService)
  private changeDetector = inject(ChangeDetectorRef)

  cart$: Observable<Product[]> = this.store.select(selectCart).pipe(
    filter(cart => !!cart) 
  )
  usStates = this.utilService.getStates()

  user: User | null = null
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
    this.fetchUserData()
  }

  initializeForm(): void {
    this.personalForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })
  }

  fetchUserData(): void {
    this.user = this.route.snapshot.data['user']
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
    if(this.optionState === option) return
    
    this.optionState = option
    if (option === 'personal') setTimeout(() => this.nameInput?.nativeElement.focus(), 1000)

    this.changeDetector.detectChanges()
  }

  onSubmitPurchase() {
    console.log('THE ON SUBMIT WORKED!');
    
    
  }


}
