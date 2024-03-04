import { Component, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from '../../models/user'
import { selectLoggedinUser, selectUser } from '../../store/user.selectors'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { DeviceTypeService } from '../../services/device-type.service'
import { LOAD_USER } from '../../store/user.actions'
import { selectOrders } from '../../store/order.selectors'
import { Order } from '../../models/order'
import { LOAD_FILTER, LOAD_ORDERS } from '../../store/order.actions'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private store = inject(Store<AppState>)
  private dTypeService = inject(DeviceTypeService)

  public backgroundImage: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1705581236/u5qpc2zretuthgb3n5ox.png'

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  user$: Observable<User> = this.store.select(selectUser)
  orders$: Observable<Order[]> = this.store.select(selectOrders)
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  optionState: string = 'order1'

  ngOnInit(): void {
    this.loggedinUser$.subscribe((user: User) => {
      if (user._id) {
        const filterBy = { id: user._id }
        this.store.dispatch(LOAD_USER({ userId: user._id }))
        this.store.dispatch(LOAD_FILTER({ filterBy }))
        this.store.dispatch(LOAD_ORDERS({ filterBy }))

        // Subscribe to orders$ and log orders whenever they change
        this.orders$.subscribe(orders => console.log('Orders:', orders))
      }
    })

  }

  setSelection(option: string) {
    if (this.optionState === option) return
    this.optionState = option
  }

}
