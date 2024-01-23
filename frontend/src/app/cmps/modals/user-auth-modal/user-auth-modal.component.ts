import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Store, select } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { EMPTY, Observable, Subscription, debounceTime, filter, take } from 'rxjs'
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
  codeSent: boolean = false
  message: string = 'Dear user, to ensure the safety of your account, we\'d like you to verify yourself.'
  timer: number = 0
  resendAvailable: boolean = false
  private resendCodeTimer?: number
  private closeModalTimer?: number

  ngOnInit() {
    this.loggedinUser$ = this.store.pipe(select(selectLoggedinUser))

    this.userSubscription = this.loggedinUser$.subscribe(user => {
      if (!user || user._id === '' || user.username === '') return
      if (this.modService.isModalOpen('user-auth')) {
        this.initializeForm()
        this.closeModalTimer = setTimeout(() => {
          this.closeModal()
        }, 300000) as unknown as number
      }
    })
  }

  initializeForm(): void {
    this.verifyForm = this.fBuilder.group({
      code: ['', [Validators.required, this.codeValidator.bind(this)]]
    })
    this.verifyForm.valueChanges.pipe(
      filter(() => this.verifyForm.valid),
      debounceTime(500)
    ).subscribe(() => this.onSubmit())
  }

  sendCode() {
    this.loggedinUser$.pipe(take(1)).subscribe(user => {
      if (user && user._id && !user.isVerified) {
        // Generate and send code
        this.verificationCode = this.utilService.generateRandomCode()
        const verifyFormData = {
          code: this.verificationCode,
          email: user.email,
          username: user.username
        }
        this.utilService.sendVerificationMail(verifyFormData).subscribe({
          next: () => {
            this.codeSent = true
            this.message = 'We\'ve sent the code to your email address, please insert it below.'
            this.resendAvailable = false
            this.startResendTimer()
          },
          error: (error) => console.error('Failed to send mail:', error)
        })
      }
    })
  }

  startResendTimer() {
    if (this.resendCodeTimer) clearInterval(this.resendCodeTimer)

    this.timer = 60
    this.resendCodeTimer = setInterval(() => {
      if (this.timer > 0) this.timer--
      else {
        this.resendAvailable = true
        clearInterval(this.resendCodeTimer)
      }
    }, 1000) as unknown as number
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
    if (this.closeModalTimer) clearTimeout(this.closeModalTimer)
  }

  onSubmit() {
    if (this.verifyForm.value.code === this.verificationCode) {
      this.loggedinUser$.pipe(take(1)).subscribe(user => {
        if (user && user._id) {
          const updatedUser: User = { ...user, isVerified: true }
          this.store.dispatch(UPDATE_USER({ updatedUser }))
          showSuccessMsg('User Verified!', 'Thank you for your patience',
            this.eBusService)
        }
      })
      this.closeModal()
    } else {
      showErrorMsg('Verification failed!', 'Please try again later',
        this.eBusService)
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe()
    if (this.resendCodeTimer) clearInterval(this.resendCodeTimer)
    if (this.closeModalTimer) clearTimeout(this.closeModalTimer)
  }
}
