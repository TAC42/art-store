import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { CHECK_SESSION } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'
import { filter, Observable, Subscription } from 'rxjs'
import { NavigationEnd, Router, RouterEvent } from '@angular/router'
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
  public hideFooterHeader: boolean = false
  private dimSubscription: Subscription | undefined
  private routerEvSubscription: Subscription | undefined
  private userSubscription: Subscription | undefined

  loggedinUser$: Observable<User> = this.store.pipe(select(selectLoggedinUser))

  ngOnInit() {
    // user session check
    this.store.dispatch(CHECK_SESSION())

    this.userSubscription = this.store.pipe(select(selectLoggedinUser)).subscribe(
      user => {
        if (user._id && !user.isVerified) {
          this.modService.openModal('user-auth')
        }
      })

    // scroll to top management
    this.routerEvSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navigationEndEvent = event as NavigationEnd
      const url = navigationEndEvent.urlAfterRedirects || navigationEndEvent.url
      console.log('this is the url: ',url);
      
      const hideHeaderFooterUrls = ['/payment']
      const shouldHideHeaderFooter = hideHeaderFooterUrls.some(urlToHide => url.startsWith(urlToHide))
      if (shouldHideHeaderFooter) {
        this.hideFooterHeader = true
      } else {
        this.hideFooterHeader = false
      }

      window.scrollTo(0, 0);
    });

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