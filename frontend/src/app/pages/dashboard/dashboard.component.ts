import { Component, inject } from '@angular/core';
import { AppState } from '../../store/app.state';
import { OrderService } from '../../services/order.service';
import { Store } from '@ngrx/store';
import { DeviceTypeService } from '../../services/device-type.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { selectUser } from '../../store/user.selectors';
import { selectOrders } from '../../store/order.selectors';
import { LOAD_ORDERS } from '../../store/order.actions';
import { LOAD_FILTER } from '../../store/shop.actions';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
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


