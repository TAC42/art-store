import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { CHECK_SESSION } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'
import { combineLatest, filter, map, Observable, Subscription } from 'rxjs'
import { NavigationEnd, Router, RouterEvent } from '@angular/router'
import { ModalService } from '../services/modal.service'
import { selectLoggedinUser } from '../store/user.selectors'
import { User } from '../models/user'
import { DeviceTypeService } from '../services/device-type.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private dimService = inject(DimmerService)
  private dTypeService = inject(DeviceTypeService)
  public modService = inject(ModalService)

  public dimmer: boolean = false
  public hideFooterHeader: boolean = false
  private dimSubscription: Subscription | undefined
  private routerEvSubscription: Subscription | undefined
  private userSubscription: Subscription | undefined

  deviceType$: Observable<string> = this.dTypeService.deviceType$
  loggedinUser$: Observable<User> = this.store.pipe(select(selectLoggedinUser))

  ngOnInit() {
    // user session check
    this.store.dispatch(CHECK_SESSION())

    this.userSubscription = this.loggedinUser$.subscribe(user => {
      if (user._id && !user.isVerified) this.modService.openModal('user-auth')
    })
    // scroll to top & Header and Footer display management
    this.routerEvSubscription = combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.deviceType$]).pipe(
        map(([event, deviceType]) => ({
          url: (event as NavigationEnd).urlAfterRedirects
            || (event as NavigationEnd).url, deviceType
        }))
      ).subscribe(({ url, deviceType }) => {
        const hideHeaderFooterUrls = ['/payment', '/shop/details']
        const isMobile = deviceType === 'mobile' || deviceType === 'mini-tablet'

        // check if a certain url requires hiding of header & footer, and if specifically on mobile
        this.hideFooterHeader = hideHeaderFooterUrls.some(urlToHide => {
          if (url.startsWith(urlToHide)) return urlToHide !== '/shop/details' || isMobile

          return false
        })
        window.scrollTo(0, 0) // scroll to top of the page
      })
    // dimmer management
    this.dimSubscription = this.dimService.dimmerSubject.subscribe(
      (active: boolean) => this.dimmer = active)
  }

  onCloseDimmer(event: Event) {
    event.stopPropagation()
    this.dimService.setDimmerActive(false)
  }

  ngOnDestroy() {
    if (this.dimSubscription) this.dimSubscription.unsubscribe()
    if (this.routerEvSubscription) this.routerEvSubscription.unsubscribe()
    if (this.userSubscription) this.userSubscription.unsubscribe()
  }
}