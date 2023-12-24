import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnDestroy {
  title = 'Ori Art Store'
  ocLogo: string = 'ocLogo'
  deviceType: string = 'mini-tablet'
  private subscription: Subscription

  constructor(private deviceTypeService: DeviceTypeService) {
    this.subscription = this.deviceTypeService.deviceType$.subscribe(
      (type) => this.deviceType = type
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}