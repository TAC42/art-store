import { Component, Input, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ModalService } from '../../../services/utils/modal.service'
import { AppState } from '../../../store/app.state'
import { Store } from '@ngrx/store'
import { User } from '../../../models/user'
import { Router } from '@angular/router'
import { LOGOUT } from '../../../store/user/user.actions'

@Component({
  selector: 'header-dropdown',
  templateUrl: './header-dropdown.component.html'
})

export class HeaderDropdownComponent {
  @Input() user$!: Observable<User>

  private store = inject(Store<AppState>)
  public modService = inject(ModalService)
  private router = inject(Router)

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