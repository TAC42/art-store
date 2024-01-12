import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { SET_LOGGEDIN_USER, LOGOUT } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'
import { filter, Subscription } from 'rxjs'
import { NavigationEnd, Router } from '@angular/router'

const SESSION_KEY_LOGGEDIN_USER = 'loggedinUser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private dimService = inject(DimmerService)

  dimmer: boolean = false
  dimSubscription: Subscription | undefined
  private routerEvSubscription: Subscription | undefined

  ngOnInit() {
    // user session check
    const userJson = sessionStorage.getItem(SESSION_KEY_LOGGEDIN_USER)
    if (userJson) {
      const loggedinUser = JSON.parse(userJson)
      this.store.dispatch(SET_LOGGEDIN_USER({ user: loggedinUser }))
    } else this.store.dispatch(LOGOUT())

    // dimmer management
    this.dimSubscription = this.dimService.dimmerSubject.subscribe((active: boolean) => {
      this.dimmer = active
    })

    // scroll to top management
    this.routerEvSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0)
    })
  }

  onCloseDimmer(event: Event) {
    event.stopPropagation()
    this.dimService.setDimmerActive(false)
  }

  ngOnDestroy() {
    if (this.dimSubscription) this.dimSubscription.unsubscribe()
    if (this.routerEvSubscription) this.routerEvSubscription.unsubscribe()
  }
}