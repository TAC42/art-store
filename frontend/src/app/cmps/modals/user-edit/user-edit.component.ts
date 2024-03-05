import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../../models/user';
import { ModalService } from '../../../services/modal.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { Router } from '@angular/router';
import { LOAD_USER } from '../../../store/user.actions';
import { selectUser } from '../../../store/user.selectors';
import { DeviceTypeService } from '../../../services/device-type.service';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  animations: [
    trigger('slideInOut', [
      state('visible', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(100%)'
      })),
      transition('hidden => visible', animate('500ms ease-out')),
      transition('visible => hidden', animate('500ms ease-in'))
    ])
  ]
})

export class UserEditComponent implements OnInit {
  @Input() loggedinUser$!: Observable<User>

  public modService = inject(ModalService)
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private dTypeService = inject(DeviceTypeService)

  private modalSubscription: Subscription | undefined
  
  user$: Observable<User> = this.store.select(selectUser)
  deviceType$: Observable<string> = this.dTypeService.deviceType$
  userEditState: string = 'hidden'

  ngOnInit(): void {
    this.loggedinUser$.subscribe((user: User) => {
      if (user._id) {
        this.store.dispatch(LOAD_USER({ userId: user._id }))
      }
    })

    this.modalSubscription = this.modService.onModalStateChange('user-edit').subscribe(
      isOpen => {
        console.log('Modal State Change:', isOpen)
        if (isOpen) setTimeout(() => this.userEditState = 'visible', 60)
        else this.userEditState = 'hidden'
      })
  }

  closeUserEdit() {
    this.userEditState = 'hidden'
    setTimeout(() => this.modService.closeModal('user-edit'), 600)
  }
}
