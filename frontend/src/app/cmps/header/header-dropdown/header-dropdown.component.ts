import { Component, Input, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { User } from '../../../models/user'
import { LOGOUT } from '../../../store/user/user.actions'
import { ModalService } from '../../../services/utils/modal.service'

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
    this.router.navigate(['/'])
  }

  closeDropdown(): void {
    this.modService.closeModal('user-dropdown')
  }
}