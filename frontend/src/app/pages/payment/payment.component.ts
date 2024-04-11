import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EMPTY, Observable, catchError, combineLatest, filter, from, mergeMap, of, switchMap, take, tap, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { loadScript } from '@paypal/paypal-js'
import { User } from '../../models/user'
import { Product } from '../../models/shop'
import { AppState } from '../../store/app.state'
import { OrderService } from '../../services/api/order.service'
import { FormUtilsService } from '../../services/utils/form-utils.service'
import { UtilityService } from '../../services/utils/utility.service'
import { SAVE_ORDER } from '../../store/order/order.actions'
import { CART_LOADED } from '../../store/product/shop.actions'
import { selectCart } from '../../store/product/shop.selectors'
import { UPDATE_USER } from '../../store/user/user.actions'
import { selectUser } from '../../store/user/user.selectors'


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
  payType: string = 'paypal'
  paypalClientId: string = ''

  public formUtils = this.formUtilsService
  public paymentForm!: FormGroup
  public personalForm!: FormGroup

  ngOnInit() {
    this.initializeForms()
    this.orderSummary$ = this.orderService.getOrderSummary$(this.cart$)

    this.loadPayPalScript()
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


  // loadPayPalScript(): void {
  //   this.orderService.getPaypalClientId().pipe(
  //     catchError(error => {
  //       console.error('Failed to fetch PayPal client ID:', error)
  //       return throwError(error)
  //     }),
  //     switchMap((clientId: string) => {
  //       const scriptOptions = {
  //         clientId: clientId
  //       }
  //       return loadScript(scriptOptions)
  //     })
  //   ).subscribe(
  //     () => {
  //       if (window.paypal && typeof window.paypal.Buttons === 'function') {
  //         window.paypal.Buttons({
  //           onInit: (data, actions) => {
  //             actions.disable()

  //             this.personalForm.statusChanges.subscribe(status => {
  //               if (status === 'VALID') {
  //                 actions.enable()
  //               } else {
  //                 actions.disable()
  //               }
  //             })
  //           },
  //           createOrder: () => {
  //             return new Promise((resolve, reject) => {
  //               const userData = this.personalForm.value;
  //               combineLatest([this.cart$, this.user$]).pipe(
  //                 take(1),
  //                 mergeMap(([cart, user]) => {
  //                   const order = this.orderService.createOrder(cart, user, userData, 'paypal');
  //                   console.log('order in loadPayPal: ', order);

  //                   return this.orderService.createPayPalOrder(order).toPromise();
  //                 })
  //               ).subscribe({
  //                 next: (orderId: any) => {
  //                   console.log('THIS IS THE ORDERID: ', orderId)
  //                   if (orderId) {
  //                     resolve(orderId.paypalOrderId)
  //                   } else {
  //                     reject(new Error('orderId is undefined'))
  //                   }
  //                 },
  //                 error: (error: any) => {
  //                   console.error('Error creating PayPal order:', error)
  //                   reject(error);
  //                 },
  //                 complete: () => {
  //                   // Complete callback
  //                 }
  //               })
  //             })
  //           },
  //           onApprove: (data, actions) => {
  //             if (actions.order) {
  //               return actions.order.capture().then(() => {
  //                 this.onSubmitPurchase()
  //                 console.log('THE TRANSACTION WAS SUCCESSFUL')
  //               })
  //             } else {
  //               console.error('actions.order is undefined.')
  //               return Promise.resolve()
  //             }
  //           },
  //           fundingSource: window.paypal.FUNDING['VENMO']
  //         }).render('#paypal-button-container')
  //       } else {
  //         console.error('PayPal script loaded but window.paypal or window.paypal.Buttons is undefined.')
  //       }
  //     },
  //     error => {
  //       console.error('Failed to load PayPal script:', error)
  //     }
  //   )
  // }
  loadPayPalScript(): void {
    this.orderService.getPaypalClientId().pipe(
      catchError(error => {
        console.error('Failed to fetch PayPal client ID:', error)
        return throwError(error)
      }),
      switchMap((clientId: string) => {
        const scriptOptions = {
          clientId: clientId
        }
        return loadScript(scriptOptions)
      })
    ).subscribe(
      () => {
        if (window.paypal && typeof window.paypal.Buttons === 'function') {
          const paypalConfig = {
            onInit: (data: any, actions: any) => {
              actions.disable()

              this.personalForm.statusChanges.subscribe(status => {
                if (status === 'VALID') {
                  actions.enable()
                } else {
                  actions.disable()
                }
              })
            },
            createOrder: () => {
              return new Promise<string>((resolve, reject) => {
                const userData = this.personalForm.value
                combineLatest([this.cart$, this.user$]).pipe(
                  take(1),
                  mergeMap(([cart, user]) => {
                    const order = this.orderService.createOrder(cart, user, userData, 'paypal')
                    console.log('order in loadPayPal: ', order)

                    return this.orderService.createPayPalOrder(order).toPromise()
                  })
                ).subscribe({
                  next: (orderId: any) => {
                    console.log('THIS IS THE ORDERID: ', orderId)
                    if (orderId) {
                      resolve(orderId.paypalOrderId)
                    } else {
                      reject(new Error('orderId is undefined'))
                    }
                  },
                  error: (error: any) => {
                    console.error('Error creating PayPal order:', error)
                    reject(error)
                  },
                  complete: () => {
                    // Complete callback
                  }
                })
              })
            },
            onApprove: (data: any, actions: any) => {
              if (actions.order) {
                return actions.order.capture().then(() => {
                  this.onSubmitPurchase()
                  console.log('THE TRANSACTION WAS SUCCESSFUL')
                })
              } else {
                console.error('actions.order is undefined.')
                return Promise.resolve()
              }
            }
          }

          // // Check if VENMO is available before setting funding source
          // if (window.paypal.FUNDING && 'VENMO' in window.paypal.FUNDING) {
          //   const fundingSource = window.paypal.FUNDING['VENMO'];
          //   (paypalConfig as any)['fundingSource'] = fundingSource
          // }

          window.paypal.Buttons(paypalConfig).render('#paypal-button-container')
        } else {
          console.error('PayPal script loaded but window.paypal or window.paypal.Buttons is undefined.')
        }
      },
      error => {
        console.error('Failed to load PayPal script:', error)
      }
    )
  }


}

