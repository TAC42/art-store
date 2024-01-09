import { Component, HostBinding, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { SET_LOGGEDIN_USER, LOGOUT } from '../store/user.actions'
import { DimmerService } from '../services/dimmer.service'

const SESSION_KEY_LOGGEDIN_USER = 'loggedinUser'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>, private dimmerService: DimmerService) { }
  
  @HostBinding('class.modal-wrapper') get isDimmerActive() {
    return this.dimmerService.dimmerActive
  }

  ngOnInit() {
    const userJson = sessionStorage.getItem(SESSION_KEY_LOGGEDIN_USER)
    if (userJson) {
      const loggedinUser = JSON.parse(userJson)
      this.store.dispatch(SET_LOGGEDIN_USER({ user: loggedinUser }))
    } else this.store.dispatch(LOGOUT())
  }
}