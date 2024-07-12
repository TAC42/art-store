import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { trigger, style, animate, transition, state } from '@angular/animations'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { User } from '../../../models/user'
import { LOGOUT } from '../../../store/user/user.actions'
import { ModalService } from '../../../services/utils/modal.service'

@Component({
  selector: 'aside-menu',
  templateUrl: './aside-menu.component.html',
  animations: [
    trigger('slideInOut', [
      state('visible', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(-100%)'
      })),
      transition('hidden => visible', animate('500ms ease-out')),
      transition('visible => hidden', animate('500ms ease-in'))
    ])
  ]
})

export class AsideMenuComponent implements OnInit, OnDestroy {
  @Input() user$!: Observable<User>

  public modService = inject(ModalService)
  private store = inject(Store<AppState>)
  private router = inject(Router)

  private modalSubscription: Subscription | undefined
  menuState: string = 'hidden'

  ngOnInit() {
    this.modalSubscription = this.modService.onModalStateChange('aside-menu').subscribe(isOpen => {
      if (isOpen) setTimeout(() => this.menuState = 'visible', 60)
      else this.menuState = 'hidden'
    })
  }

  closeMenu() {
    this.menuState = 'hidden'
    setTimeout(() => this.modService.closeModal('aside-menu'), 600)
  }

  openLogin(event: MouseEvent) {
    event.stopPropagation()
    this.modService.openModal('login')
    this.closeMenu()
  }

  exitAccount(event: MouseEvent) {
    event.stopPropagation()
    this.store.dispatch(LOGOUT())
    this.closeMenu()
    this.router.navigate(['/'])
  }

  ngOnDestroy() {
    if (this.modalSubscription) this.modalSubscription.unsubscribe()
  }
}