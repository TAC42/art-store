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
  burgerMenuIcon: string = 'burgerMenuIcon'
  searchIcon: string = 'searchIcon'
  searchState: boolean = false
  searchValue: string = ''
  deviceType: string = 'mini-tablet'
  dimmerSubscription: Subscription | undefined
  private router = inject(Router)
  private dimmerService = inject(DimmerService)
  private subscription: Subscription
 


  constructor(private deviceTypeService: DeviceTypeService) {
    this.subscription = this.deviceTypeService.deviceType$.subscribe(
      (type) => this.deviceType = type
    )
  }

  @Output() toggleAsideMenu = new EventEmitter<void>()

  ngOnInit(): void {
    this.dimmerSubscription = this.dimmerService.dimmerSubject.subscribe((active: boolean) => {
      this.searchState = active;
    })
  }
  onToggleAsideMenu(event: MouseEvent) {
    event.stopPropagation()
    this.toggleAsideMenu.emit()
  }

  onOpenSearch() {
    // this.searchState = !this.searchState
    if (!this.searchState) this.dimmerService.setDimmerActive(true)
    else {
      this.dimmerService.setDimmerActive(false)
      console.log('THIS IS WHEN SEARCH STATE IS FALSE ', this.searchState)
    }
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