import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { SET_LOGGEDIN_USER, LOGOUT } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'
import { Subscription } from 'rxjs'

const SESSION_KEY_LOGGEDIN_USER = 'loggedinUser'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private dimmerService: DimmerService) { }
  dimmer: boolean = false
  dimmerSubscription: Subscription | undefined


  ngOnInit() {
    const userJson = sessionStorage.getItem(SESSION_KEY_LOGGEDIN_USER)
    if (userJson) {
      const loggedinUser = JSON.parse(userJson)
      this.store.dispatch(SET_LOGGEDIN_USER({ user: loggedinUser }))
    } else this.store.dispatch(LOGOUT())

    this.dimmerSubscription = this.dimmerService.dimmerSubject.subscribe((active: boolean) => {
      this.dimmer = active;
    })

  }

  onCloseDimmer(event: Event){
    event.stopPropagation()
    this.dimmerService.setDimmerActive(false)
  }
  ngOnDestroy() {
    if (this.dimmerSubscription) {
      this.dimmerSubscription.unsubscribe()
    }
  }
}