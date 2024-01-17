import { Component, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core'
import { trigger, style, animate, transition, state } from '@angular/animations'
import { ModalService } from '../../services/modal.service'
import { AppState } from '../../store/app.state'
import { Store, select } from '@ngrx/store'
import { User } from '../../models/user'
import { selectLoggedinUser } from '../../store/user.selectors'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { LOGOUT } from '../../store/user.actions'

@Component({
  selector: 'app-aside-menu',
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
  public modService = inject(ModalService)
  private store = inject(Store<AppState>)
  private elRef = inject(ElementRef)

  private modalSubscription: Subscription | undefined
  loggedinUser$: Observable<User> = EMPTY
  menuState: string = 'hidden'

  ngOnInit() {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))

    this.modalSubscription = this.modService.onModalStateChange('aside-menu').subscribe(isOpen => {
      if (isOpen) {
        setTimeout(() => this.menuState = 'visible', 60)
      } else this.menuState = 'hidden'
    })
  }

  closeMenu() {
    this.menuState = 'hidden'
    setTimeout(() => {
      this.modService.closeModal('aside-menu')
    }, 600)
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
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target)

    if (!clickedInside) this.closeMenu()
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }
}