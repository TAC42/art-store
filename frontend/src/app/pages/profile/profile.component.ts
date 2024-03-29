import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { User } from '../../models/user'
import { Order } from '../../models/order'
import { selectUser } from '../../store/user.selectors'
import { selectOrders } from '../../store/order.selectors'
import { LOAD_FILTER, LOAD_ORDERS } from '../../store/order.actions'
import { DeviceTypeService } from '../../services/device-type.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.full') fullClass = true

  private store = inject(Store<AppState>)
  private dTypeService = inject(DeviceTypeService)
  public modService = inject(ModalService)

  public backgroundImage: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1706644779/ibir2pid5kftim9u7fvu.png'

  user$: Observable<User> = this.store.select(selectUser)
  orders$: Observable<Order[]> = this.store.select(selectOrders)
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  optionState: string = 'order1'

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user._id) {
        const filterBy = { _id: user._id }
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
    return statusColors[status.toLowerCase() as 'pending' |
      'shipped' | 'delivered'] || 'gray'
  }

  onOpenUserEdit(event: Event): void {
    event.stopPropagation()
    this.modService.openModal('user-edit')
  }
}