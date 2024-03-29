import { Component, Input, OnInit, inject } from '@angular/core'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Observable, Subscription, debounceTime, distinctUntilChanged, first, of, switchMap, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { User } from '../../../models/user'
import { AppState } from '../../../store/app.state'
import { UPDATE_USER } from '../../../store/user.actions'
import { ModalService } from '../../../services/modal.service'
import { FormUtilsService } from '../../../services/form-utils.service'
import { UserService } from '../../../services/user.service'

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
  @Input() user$!: Observable<User>

  private store = inject(Store<AppState>)
  private fBuilder = inject(FormBuilder)
  public modService = inject(ModalService)
  private userService = inject(UserService)
  private formUtilsService = inject(FormUtilsService)

  private modalSubscription: Subscription | undefined

  public formUtils = this.formUtilsService
  public userEditForm!: FormGroup
  public userEditState: string = 'hidden'
  public initialFormData: User | null = null

  ngOnInit(): void {
    this.initializeForm()
    this.modalSubscription = this.modService.onModalStateChange('user-edit').subscribe(isOpen => {
      if (isOpen) setTimeout(() => this.userEditState = 'visible', 60)
      else this.userEditState = 'hidden'
    })
  }

  initializeForm(): void {
    this.user$.subscribe(user => {
      this.initialFormData = user
      this.userEditForm = this.fBuilder.group({
        imgUrl: this.fBuilder.array(user.imgUrl?.map(
          url => this.fBuilder.control(url))),
        fullName: [user.fullName, [Validators.required]],
        username: [user.username, [Validators.required], this.usernameValidator()],
        email: [user.email, [Validators.required, Validators.email], this.emailValidator()],
      })
    })
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges ||
        control.value === this.initialFormData?.username) return of(null)

      return control.valueChanges.pipe(
        debounceTime(500), distinctUntilChanged(), switchMap(value =>
          this.userService.validateUsername(value)), first()
      )
    }
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges ||
        control.value === this.initialFormData?.email) return of(null)

      return control.valueChanges.pipe(
        debounceTime(500), distinctUntilChanged(), switchMap(value =>
          this.userService.validateEmail(value)), first()
      )
    }
  }

  get imgUrlsControls(): AbstractControl[] {
    return (this.userEditForm.get('imgUrl') as FormArray).controls
  }

  handleImgUpload(event: { url: string, index: number, controlName: string }): void {
    this.formUtils.handleImageUpload(this.userEditForm, event)
  }

  onSaveUser() {
    this.user$.pipe(take(1)).subscribe(user => {
      const formData = this.userEditForm.value
      const updatedUser = { ...user, ...formData }
      this.store.dispatch(UPDATE_USER({ updatedUser: updatedUser }))
    })
    this.closeUserEdit()
  }

  closeUserEdit() {
    this.userEditState = 'hidden'
    setTimeout(() => this.modService.closeModal('user-edit'), 600)
  }

  ngOnDestroy() {
    if (this.modalSubscription) this.modalSubscription.unsubscribe()
  }
}