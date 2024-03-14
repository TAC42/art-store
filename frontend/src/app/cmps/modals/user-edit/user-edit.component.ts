import { Component, Input, OnInit, inject } from '@angular/core'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable, Subscription, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { User } from '../../../models/user'
import { AppState } from '../../../store/app.state'
import { UPDATE_USER } from '../../../store/user.actions'
import { ModalService } from '../../../services/modal.service'
import { FormUtilsService } from '../../../services/form-utils.service'

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
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

export class UserEditComponent implements OnInit {
  @Input() deviceType$!: Observable<string>
  @Input() user$!: Observable<User>

  public modService = inject(ModalService)
  private store = inject(Store<AppState>)
  private formUtilsService = inject(FormUtilsService)
  private fBuilder = inject(FormBuilder)

  private modalSubscription: Subscription | undefined

  public formUtils = this.formUtilsService
  public userEditForm!: FormGroup
  public userEditState: string = 'hidden'
  public initialUserData: User | null = null

  ngOnInit(): void {
    this.initializeForm()
    this.modalSubscription = this.modService.onModalStateChange('user-edit').subscribe(isOpen => {
      if (isOpen) setTimeout(() => this.userEditState = 'visible', 60)
      else this.userEditState = 'hidden'
    })
  }

  initializeForm(): void {
    this.user$.subscribe(user => {
      this.initialUserData = user
      this.userEditForm = this.fBuilder.group({
        imgUrl: [user.imgUrl, [Validators.required]],
        fullName: [user.fullName, [Validators.required]],
        username: [user.username, [Validators.required]],
        email: [user.email, [Validators.required, Validators.email]],
      })
    })
  }

  isUserDataUnchanged(): boolean {
    if (!this.initialUserData) return false
    const formData = this.userEditForm.value
    return (
      formData.fullName === this.initialUserData.fullName &&
      formData.username === this.initialUserData.username &&
      formData.email === this.initialUserData.email
    )
  }

  closeUserEdit() {
    this.userEditState = 'hidden'
    setTimeout(() => this.modService.closeModal('user-edit'), 600)
  }

  onSaveUser() {
    this.user$.pipe(take(1)).subscribe(user => {
      const formData = this.userEditForm.value
      const updatedUser = { ...user, ...formData }
      this.store.dispatch(UPDATE_USER({ updatedUser: updatedUser }))
    })
    this.closeUserEdit()
  }

  ngOnDestroy() {
    if (this.modalSubscription) this.modalSubscription.unsubscribe()
  }
}