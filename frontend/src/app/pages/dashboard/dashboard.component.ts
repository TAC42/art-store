import { Component, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { User } from '../../models/user'
import { Order } from '../../models/order'
import { selectUser } from '../../store/user/user.selectors'
import { selectOrders } from '../../store/order/order.selectors'
import { LOAD_ORDERS } from '../../store/order/order.actions'
import { LOAD_FILTER } from '../../store/product/product.actions'
import { OrderService } from '../../services/api/order.service'
import { DeviceTypeService } from '../../services/utils/device-type.service'

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  host: { 'class': 'full w-h-100' }
})

export class DashboardComponent {
  optionState: string = ''
  orderStatus: object = {}
  private store = inject(Store<AppState>)
  private orderService = inject(OrderService)
  private dTypeService = inject(DeviceTypeService)


  user$: Observable<User> = this.store.select(selectUser)
  orders$: Observable<Order[]> = this.store.select(selectOrders)
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user._id) {
        const filterBy = {}
        this.store.dispatch(LOAD_FILTER({ filterBy }))
        this.store.dispatch(LOAD_ORDERS({ filterBy }))
      }
    })
  }
}
