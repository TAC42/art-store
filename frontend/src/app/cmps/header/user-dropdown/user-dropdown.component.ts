import { Component, OnInit, inject } from '@angular/core'
import { EMPTY, Observable } from 'rxjs'
import { ModalService } from '../../../services/modal.service'
import { AppState } from '../../../store/app.state'
import { Store, select } from '@ngrx/store'
import { User } from '../../../models/user'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { Router } from '@angular/router'
import { LOGOUT } from '../../../store/user.actions'

@Component({
  selector: 'user-dropdown',
  templateUrl: './user-dropdown.component.html'
})

export class UserDropdownComponent implements OnInit {
  private store = inject(Store<AppState>)
  public modService = inject(ModalService)
  private router = inject(Router)

  loggedinUser$: Observable<User> = EMPTY

  ngOnInit(): void {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))
  }

  openLogin(event: MouseEvent) {
    event.stopPropagation()
    this.modService.openModal('login')
    this.closeDropdown()
  }

  exitAccount(event: MouseEvent) {
    event.stopPropagation()
    this.store.dispatch(LOGOUT())
    this.closeDropdown()
    this.navigateTo('/')
  }

  navigateTo(url: string) {
    this.router.navigate([url])
    this.closeDropdown()
  }

  closeDropdown(): void {
    this.modService.closeModal('user-dropdown')
  }
}
