import { Component, OnDestroy, Output, EventEmitter, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { filterUpdated } from '../../store/shop.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { ShopFilter } from '../../models/shop'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnDestroy {
  title = 'Ori Art Store'
  searchState: boolean = false
  searchValue: string = ''
  burgerMenuIcon: string = 'burgerMenuIcon'
  searchIcon: string = 'searchIcon'
  deviceType: string = 'mini-tablet'
  private router = inject(Router)
    private route = inject(ActivatedRoute)
  private subscription: Subscription

  constructor(private store: Store<AppState>,
    private deviceTypeService: DeviceTypeService) {
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
    if (!this.searchState && this.searchValue.trim() !== '') {
      this.router.navigateByUrl(`/shop?search=${encodeURIComponent(this.searchValue.trim())}`)
    }
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue = target.value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}