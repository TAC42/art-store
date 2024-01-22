import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Store, select } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { EMPTY, Observable, Subscription, take } from 'rxjs'
import { User } from '../../../models/user'
import { UtilityService } from '../../../services/utility.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { UPDATE_USER } from '../../../store/user.actions'

@Component({
  selector: 'user-auth-modal',
  templateUrl: './user-auth-modal.component.html'
})

export class UserAuthModalComponent implements OnInit, OnDestroy {
  public modService = inject(ModalService)
  private utilService = inject(UtilityService)
  private eBusService = inject(EventBusService)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)

  loggedinUser$: Observable<User> = EMPTY
  private userSubscription?: Subscription

  verifyForm!: FormGroup
  verificationCode: string = ''

  ngOnInit() {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))

    this.userSubscription = this.loggedinUser$.subscribe(user => {
      if (!user || user._id === '' || user.username === '') return
      if (user.isVerified) this.closeModal()

      else if (this.modService.isModalOpen('user-auth')) {
        // Generate verification code
        this.verificationCode = this.utilService.generateRandomCode()
        const verifyFormData = {
          code: this.verificationCode,
          email: user.email,
          username: user.username
        }
        // Send verification mail
        this.utilService.sendVerificationMail(verifyFormData).subscribe({
          error: (error) => console.error('Failed to send mail:', error)
        })
        this.initializeForm()
      }
    })
  }

  initializeForm(): void {
    this.verifyForm = this.fBuilder.group({
      code: ['', [Validators.required, this.codeValidator.bind(this)]]
    })
  }

  codeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null

    return control.value === this.verificationCode ? null : { codeMismatch: true }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.verifyForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.verifyForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`
    if (field?.errors?.['codeMismatch']) return 'The code does not match'

    return ''
  }

  closeModal() {
    this.modService.closeModal('user-auth')
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      if (this.verifyForm.value.code === this.verificationCode) {
        this.loggedinUser$.pipe(take(1)).subscribe(user => {
          if (user && user._id) {
            const updatedUser: User = { ...user, isVerified: true }
            this.store.dispatch(UPDATE_USER({ updatedUser }))
            console.log('User verification updated')
            showSuccessMsg('User Verified!',
              'Thank you for your patience', this.eBusService)
          }
        })
        this.closeModal()
      } else {
        console.error('Verification code does not match')
        showErrorMsg('Verification failed!',
          'Please try again later', this.eBusService)
      }
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe()
  }
}
