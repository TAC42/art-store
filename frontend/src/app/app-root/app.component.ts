import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { SET_LOGGEDIN_USER, LOGOUT } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'
import { filter, Subscription } from 'rxjs'
import { NavigationEnd, Router } from '@angular/router'
import { ModalService } from '../services/modal.service'
import { selectLoggedinUser } from '../store/user.selectors'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private dimService = inject(DimmerService)
  public modService = inject(ModalService)

  dimmer: boolean = false
  dimSubscription: Subscription | undefined
  private routerEvSubscription: Subscription | undefined
  private userSubscription: Subscription | undefined

  ngOnInit() {
    // user session check
    const loggedinUser = UserService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(SET_LOGGEDIN_USER({ user: loggedinUser }))
    } else this.store.dispatch(LOGOUT())

    this.userSubscription = this.store.pipe(select(selectLoggedinUser)).subscribe(user => {
      if (user && user.createdAt !== 0 && !user.isVerified) {
        this.modService.openModal('user-auth')
      }
    })

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
    if (this.userSubscription) this.userSubscription.unsubscribe()
  }
}