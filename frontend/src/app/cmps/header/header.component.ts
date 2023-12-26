import { Component, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnDestroy {
  title = 'Ori Art Store'
  ocLogo: string = 'ocLogo'
  burgerMenuIcon: string = 'burgerMenuIcon'
  searchIcon: string = 'searchIcon'
  deviceType: string = 'mini-tablet'
  private subscription: Subscription

  constructor(private deviceTypeService: DeviceTypeService) {
    this.subscription = this.deviceTypeService.deviceType$.subscribe(
      (type) => this.deviceType = type
    )
  }

  @Output() toggleAsideMenu = new EventEmitter<void>()

  onToggleAsideMenu(event: MouseEvent) {
    event.stopPropagation()
    this.toggleAsideMenu.emit()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}