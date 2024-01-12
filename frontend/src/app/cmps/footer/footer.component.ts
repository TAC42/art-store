import { Component, OnDestroy, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnDestroy {
  private dTypeService = inject(DeviceTypeService)

  deviceType: string = 'mini-tablet'
  private dTypeSubscription: Subscription

  constructor() {
    this.dTypeSubscription = this.dTypeService.deviceType$.subscribe(
      (type) => this.deviceType = type
    )
  }

  ngOnDestroy() {
    this.dTypeSubscription.unsubscribe()
  }
}
