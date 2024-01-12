import { Component, ElementRef, HostListener, inject } from '@angular/core'
import { trigger, style, animate, transition } from '@angular/animations'
import { ModalService } from '../../services/modal.service'
import { AppState } from '../../store/app.state'
import { Store, select } from '@ngrx/store'
import { User } from '../../models/user'
import { selectLoggedinUser } from '../../store/user.selectors'
import { Observable } from 'rxjs'
import { LOGOUT } from '../../store/user.actions'

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translate3d(-100%, 0, 0)' }),
        animate('500ms ease-in-out', style({ transform: 'translate3d(0, 0, 0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translate3d(-100%, 0 ,0)' }))
      ])
    ])
  ]
})

export class AsideMenuComponent {
  private store = inject(Store<AppState>)
  private mService = inject(ModalService)
  private elRef = inject(ElementRef)

  isMenuOpen: boolean = false
  loggedinUser$: Observable<User>

  constructor() {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  get menuState() {
    return this.isMenuOpen ? 'in' : 'out'
  }

  closeMenu() {
    this.isMenuOpen = false
  }

  openLogin(event: MouseEvent) {
    event.stopPropagation()
    this.mService.openModal('login')
    this.closeMenu()
  }

  exitAccount(event: MouseEvent) {
    event.stopPropagation()
    this.store.dispatch(LOGOUT())
    this.closeMenu()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target)

    if (!clickedInside) this.closeMenu()
  }
}