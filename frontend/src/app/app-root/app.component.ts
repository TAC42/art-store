import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { CHECK_SESSION } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'
import { EMPTY, filter, Observable, Subscription } from 'rxjs'
import { NavigationEnd, Router } from '@angular/router'
import { ModalService } from '../services/modal.service'
import { selectLoggedinUser } from '../store/user.selectors'
import { User } from '../models/user'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private dimService = inject(DimmerService)
  public modService = inject(ModalService)

  public dimmer: boolean = false
  private dimSubscription: Subscription | undefined
  private routerEvSubscription: Subscription | undefined
  private userSubscription: Subscription | undefined

  loggedinUser$: Observable<User> = EMPTY

  ngOnInit() {
    // user session check
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))
    this.store.dispatch(CHECK_SESSION())

    this.userSubscription = this.store.pipe(select(selectLoggedinUser)).subscribe(
      user => {
        if (user && user.createdAt !== 0 && !user.isVerified) {
          this.modService.openModal('user-auth')
        }
      })

    // scroll to top management
    this.routerEvSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => window.scrollTo(0, 0))

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