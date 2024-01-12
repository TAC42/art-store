import { Component, OnDestroy, Output, EventEmitter, inject, HostBinding, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { Router } from '@angular/router'
import { DimmerService } from '../../services/dimmer.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class.z-50') get zIndex() {
    return this.searchState
  }
  @Output() toggleAsideMenu = new EventEmitter<void>()

  private router = inject(Router)
  private dimService = inject(DimmerService)
  private dTypeService = inject(DeviceTypeService)

  searchState: boolean = false
  searchValue: string = ''
  deviceType: string = 'mini-tablet'

  dimSubscription: Subscription | undefined
  private dTypesubscription: Subscription

  constructor() {
    this.dTypesubscription = this.dTypeService.deviceType$.subscribe(
      (type) => this.deviceType = type)
  }

  ngOnInit(): void {
    this.dimSubscription = this.dimService.dimmerSubject.subscribe((active: boolean) => {
      this.searchState = active
    })
  }
  onToggleAsideMenu(event: MouseEvent) {
    event.stopPropagation()
    this.toggleAsideMenu.emit()
  }

  onOpenSearch() {
    const currentUrl = this.router.url
    if (currentUrl.startsWith('/shop')) return

    if (!this.searchState) this.dimService.setDimmerActive(true)
    else this.dimService.setDimmerActive(false)

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
    this.dTypesubscription.unsubscribe()
  }
}