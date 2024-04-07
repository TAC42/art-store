import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Observable, debounceTime, filter, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { User } from '../../../models/user'
import { LOGOUT, UPDATE_USER } from '../../../store/user.actions'
import { ModalService } from '../../../services/modal.service'
import { UtilityService } from '../../../services/utility.service'
import { FormUtilsService } from '../../../services/form-utils.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'

@Component({
  selector: 'user-auth-modal',
  templateUrl: './user-auth-modal.component.html'
})

export class UserAuthModalComponent implements OnInit, OnDestroy {
  @Input() user$!: Observable<User>

  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  public modService = inject(ModalService)
  private utilService = inject(UtilityService)
  private formUtilsService = inject(FormUtilsService)
  private eBusService = inject(EventBusService)

  public formUtils = this.formUtilsService
  public verifyForm!: FormGroup

  public message: string = 'Dear user, to ensure the safety of your account, we\'d like you to verify yourself.'

  verificationCode: string = ''
  codeSent: boolean = false
  timer: number = 0
  resendAvailable: boolean = false
  private authModalTimer?: number

  ngOnInit(): void {
    this.user$.subscribe(() => {
      if (this.modService.isModalOpen('user-auth')) {
        this.initializeForm()
        this.authModalTimer = setTimeout(() => {
          showErrorMsg('Authentication Timeout', 'Please log back in to retry!', this.eBusService)

          this.store.dispatch(LOGOUT())
          setTimeout(() => window.location.reload(), 2000)
        }, 300000) as unknown as number
      } else clearTimeout(this.authModalTimer)
    })
  }

  initializeForm(): void {
    this.verifyForm = this.fBuilder.group({
      code: ['', [Validators.required, this.codeValidator.bind(this)]]
    })
    this.verifyForm.valueChanges.pipe(filter(() =>
      this.verifyForm.valid), debounceTime(500)).subscribe(() =>
        this.onSubmit())
  }

  sendCode(): void {
    this.user$.pipe(take(1)).subscribe(user => {
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
          this.utilService.startResendTimer().subscribe({
            next: ({ timer, resendAvailable }) => {
              this.timer = timer
              this.resendAvailable = resendAvailable
            }
          })
        },
        error: (error) => console.error('Failed to send mail:', error)
      })
    })
  }

  codeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null
    return control.value === this.verificationCode ? null : { codeMismatch: true }
  }

  onSubmit(): void {
    if (this.verifyForm.value.code === this.verificationCode) {
      this.user$.pipe(take(1)).subscribe(user => {
        const updatedUser: User = { ...user, isVerified: true }
        this.store.dispatch(UPDATE_USER({ updatedUser }))

        showSuccessMsg('User Verified!', 'Thank you for the cooperation!', this.eBusService)
        this.modService.closeModal('user-auth')
        this.verifyForm.reset()
      })
    } else showErrorMsg('Verification Failed!',
      'Please try again later', this.eBusService)
  }

  ngOnDestroy(): void {
    if (this.authModalTimer) clearTimeout(this.authModalTimer)
  }
}