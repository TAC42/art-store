import { Component, Input, inject } from '@angular/core';
import { AppState } from '../../store/app.state';
import { OrderService } from '../../services/api/order.service';
import { Store } from '@ngrx/store';
import { DeviceTypeService } from '../../services/utils/device-type.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import { selectUser } from '../../store/user/user.selectors';
import { selectOrders } from '../../store/order/order.selectors';
import { LOAD_ORDERS } from '../../store/order/order.actions';
import { LOAD_FILTER } from '../../store/product/product.actions';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
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

  setSelection(option: string): void {
    if (this.optionState === option) return
    this.optionState = option
  }

  getStatusClass(status: string): string {
    const statusColors = {
      pending: 'pending',
      accepted: 'accepted',
      delivering: 'delivering',
      shipped: 'shipped',
      cancelled: 'cancelled',
    }
    return statusColors[status.toLowerCase() as 'pending' |
      'cancelled' | 'accepted' | 'delivering' | 'shipped'] || 'gray'
  }

  openOrderStatus(id: string | undefined) {
    if (id) {
      
    }
  }

}
