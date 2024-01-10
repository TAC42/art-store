import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnDestroy {
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
