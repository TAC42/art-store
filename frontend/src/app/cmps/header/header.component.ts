import { Component, inject, HostBinding, OnInit, Input, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { DimmerService } from '../../services/dimmer.service'
import { ModalService } from '../../services/modal.service'
import { User } from '../../models/user'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input() deviceType$!: Observable<string>
  @Input() loggedinUser$!: Observable<User>

  @HostBinding('class.z-50') get zIndex() { return this.searchState }

  private router = inject(Router)
  private dimService = inject(DimmerService)
  public modService = inject(ModalService)

  searchState: boolean = false
  searchValue: string = ''

  private dimSubscription: Subscription | undefined

  ngOnInit(): void {
    this.dimSubscription = this.dimService.dimmerSubject.subscribe(
      (active: boolean) => { this.searchState = active })
  }

  openAsideMenu(event: MouseEvent) {
    event.stopPropagation()
    this.modService.openModal('aside-menu')
  }

  openDropdown(event: MouseEvent) {
    event.stopPropagation()
    this.modService.openModal('user-dropdown')
  }

  onOpenSearch(event: MouseEvent) {
    event.stopPropagation()
    const currentUrl = this.router.url
    if (currentUrl.startsWith('/shop') ||
      currentUrl.startsWith('/artware') ||
      currentUrl.startsWith('/sculpture')) return

    if (!this.searchState) this.dimService.setDimmerActive(true)
    else this.dimService.setDimmerActive(false)

    if (!this.searchState && this.searchValue.trim() !== '') {
      this.router.navigateByUrl(`/shop?search=${encodeURIComponent(this.searchValue.trim())}`)
    }
  }

  onCloseSearch() {
    this.searchState = false
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement
    this.searchValue = target.value
  }

  onClearFilter(event: Event) {
    event.stopPropagation()
    this.searchValue = ''
  }

  ngOnDestroy() {
    if (this.dimSubscription) this.dimSubscription.unsubscribe()
  }
}