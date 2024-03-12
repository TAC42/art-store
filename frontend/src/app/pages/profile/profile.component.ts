import { Component, OnInit, inject } from '@angular/core'
import { Observable, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { User } from '../../models/user'
import { selectLoggedinUser, selectUser } from '../../store/user.selectors'
import { AppState } from '../../store/app.state'
import { LOAD_USER } from '../../store/user.actions'
import { selectOrders } from '../../store/order.selectors'
import { Order } from '../../models/order'
import { LOAD_FILTER, LOAD_ORDERS } from '../../store/order.actions'
import { DeviceTypeService } from '../../services/device-type.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  private store = inject(Store<AppState>)
  private dTypeService = inject(DeviceTypeService)
  public modService = inject(ModalService)

  public backgroundImage: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1705581236/u5qpc2zretuthgb3n5ox.png'

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  user$: Observable<User> = this.store.select(selectUser)
  orders$: Observable<Order[]> = this.store.select(selectOrders)
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  optionState: string = 'order1'

  ngOnInit(): void {
    this.loggedinUser$.subscribe((user: User) => {
      if (user._id) {
        const filterBy = { _id: user._id }
        this.store.dispatch(LOAD_USER({ userId: user._id }))
        this.store.dispatch(LOAD_FILTER({ filterBy }))
        this.store.dispatch(LOAD_ORDERS({ filterBy }))
      }
    })
  }

  setSelection(option: string) {
    if (this.optionState === option) return
    this.optionState = option
  }

  getStatusClass(status: string): string {
    const statusColors = {
      pending: 'pending',
      confirmed: 'confirmed',
      shipped: 'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled',
    }
    return statusColors[status.toLowerCase() as 'pending' | 'shipped' | 'delivered'] || 'gray'
  }

  get orderSummary$(): Observable<{ total: number, taxes: number, deliveryFee: number, grandTotal: number }> {
    return this.orders$.pipe(
      map(orders => {
        let total = 0
        let taxes = 0
        let deliveryFee = 0
        let grandTotal = 0

        orders.forEach(order => {
          order.summary.forEach(item => {
            total += item.price! * (item.amount || 1)
          })
        })
        // Calculate taxes, delivery fee, and grand total based on the totals
        const nyTaxRate = 0.0875; // NY State tax rate (8.75%)
        const deliveryFeeRate = 0.12; // Delivery fee rate (12%)

        taxes = total * nyTaxRate
        deliveryFee = total * deliveryFeeRate
        grandTotal = total + taxes + deliveryFee

        return { total, taxes, deliveryFee, grandTotal }
      })
    )
  }

  onOpenUserEdit(event: Event): void {
    event.stopPropagation()
    this.modService.openModal('user-edit')
  }
}