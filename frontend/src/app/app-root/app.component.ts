import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { combineLatest, filter, map, Observable, Subscription } from 'rxjs'
import { AppState } from '../store/app.state'
import { User } from '../models/user'
import { CHECK_SESSION, LOAD_USER } from '../store/user.actions'
import { selectLoggedinUser, selectUser } from '../store/user.selectors'
import { ModalService } from '../services/modal.service'
import { DimmerService } from '../services/dimmer.service'
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
  private sessionSubscription: Subscription | undefined

  deviceType$: Observable<string> = this.dTypeService.deviceType$
  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  user$: Observable<User> = this.store.select(selectUser)

  ngOnInit() {
    this.store.dispatch(CHECK_SESSION()) // user session check

    this.sessionSubscription = this.loggedinUser$.subscribe(sessionUser => {
      if (sessionUser._id) this.store.dispatch(LOAD_USER({ userId: sessionUser._id }))
    })
    this.user$.subscribe(fullUser => {
      if (fullUser._id && !fullUser.isVerified) this.modService.openModal('user-auth')
    })
    // scroll to top & Header and Footer display management
    this.routerEvSubscription = combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.deviceType$]).pipe(map(([event, deviceType]) => ({
        url: (event as NavigationEnd).urlAfterRedirects
          || (event as NavigationEnd).url, deviceType
      }))
      ).subscribe(({ url, deviceType }) => {
        const hideHeaderFooterUrls = ['/payment', '/edit', '/shop/details', '/artware/details', '/sculpture/details']
        const mobileSensitiveUrls = ['/shop/details', '/edit', '/artware/details', '/sculpture/details']
        const isMobile = deviceType === 'mobile' || deviceType === 'mini-tablet'

        // check if a certain url requires hiding of header & footer, and if specifically on mobile
        this.hideFooterHeader = hideHeaderFooterUrls.some(urlToHide => {
          if (url.startsWith(urlToHide)) {
            if (mobileSensitiveUrls.includes(urlToHide)) return isMobile
            return true
          }
          return false
        })
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
    if (this.sessionSubscription) this.sessionSubscription.unsubscribe()
  }
}