import { Component, OnInit, inject } from '@angular/core'
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
  templateUrl: './profile.component.html',
  host: { 'class': 'full w-h-100' }
})

export class ProfileComponent implements OnInit {
  private store = inject(Store<AppState>)
  private dTypeService = inject(DeviceTypeService)
  public modService = inject(ModalService)

  public backgroundImage: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716117644/xym2cowwgn9sxyo2egog.avif'
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