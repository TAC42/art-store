import { Component, OnDestroy, Output, EventEmitter, inject, HostBinding } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { Router } from '@angular/router'
import { DimmerService } from '../../services/dimmer.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnDestroy {
  burgerMenuIcon: string = 'burgerMenuIcon'
  searchIcon: string = 'searchIcon'
  searchState: boolean = false
  searchValue: string = ''
  deviceType: string = 'mini-tablet'
  private router = inject(Router)
  private dimmerService = inject(DimmerService)
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

  onOpenSearch() {
    this.searchState = !this.searchState
    this.dimmerService.toggleDimmerClass()
    if (!this.searchState && this.searchValue.trim() !== '') {
      this.router.navigateByUrl(`/shop?search=${encodeURIComponent(this.searchValue.trim())}`)
    }
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement
    this.searchValue = target.value
  }

  onClearFilter(event: Event) {
    event.stopPropagation()
    this.searchValue = ''
  }

  closeMenu() {
    this.searchState = false
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}