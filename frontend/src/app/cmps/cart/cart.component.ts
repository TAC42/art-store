import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef } from '@angular/core'
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { ModalService } from '../../services/modal.service';
import { AppState } from '../../store/app.state';
import { Store, select } from '@ngrx/store';
import { selectLoggedinUser } from '../../store/user.selectors';

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
  isCartOpen: boolean = false

  loggedinUser$: Observable<User>

  constructor(private eR: ElementRef,
    private mS: ModalService,
    private store: Store<AppState>) {
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
