import { animate, style, transition, trigger } from '@angular/animations'
import { Component, ElementRef, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from '../../models/user'
import { ModalService } from '../../services/modal.service'
import { AppState } from '../../store/app.state'
import { Store, select } from '@ngrx/store'
import { selectLoggedinUser } from '../../store/user.selectors'

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translate3d(100%, 0, 0)' }),
        animate('500ms ease-in-out', style({ transform: 'translate3d(0, 0, 0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translate3d(100%, 0 ,0)' }))
      ])
    ])
  ]
})
export class CartComponent {
  private store = inject(Store<AppState>)
  private mService = inject(ModalService)
  private elRef = inject(ElementRef)

  isCartOpen: boolean = false
  loggedinUser$: Observable<User>

  constructor() {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen
  }

  get cartState() {
    return this.isCartOpen ? 'in' : 'out'
  }

  closeCart() {
    this.isCartOpen = false
  }
}
