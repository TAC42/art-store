import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { User } from '../../models/user'
import { Order } from '../../models/order'
import { selectUser } from '../../store/user/user.selectors'
import { selectOrders } from '../../store/order/order.selectors'
import { LOAD_FILTER, LOAD_ORDERS } from '../../store/order/order.actions'
import { DeviceTypeService } from '../../services/utils/device-type.service'
import { ModalService } from '../../services/utils/modal.service'

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
  public optionState: string = 'order1'

  user$: Observable<User> = this.store.select(selectUser)
  orders$: Observable<Order[]> = this.store.select(selectOrders)
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user._id) {
        const filterBy = { _id: user._id }
        this.store.dispatch(LOAD_FILTER({ filterBy }))
        this.store.dispatch(LOAD_ORDERS({ filterBy }))
      }
    })
  }

  onOpenUserEdit(event: Event): void {
    event.stopPropagation()
    this.modService.openModal('user-edit')
  }
}