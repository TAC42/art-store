import { Component, Input, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms'
import { Observable, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { User } from '../../../models/user'
import { UPDATE_USER } from '../../../store/user.actions'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { FormUtilsService } from '../../../services/form-utils.service'
import { ModalService } from '../../../services/modal.service'
import { UtilityService } from '../../../services/utility.service'
import { MailService } from '../../../services/mail.service'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'reset-email',
  templateUrl: './reset-email.component.html'
})

export class ResetEmailComponent implements OnInit {
  @Input() user$!: Observable<User>

  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private utilService = inject(UtilityService)
  private emailService = inject(MailService)
  private eBusService = inject(EventBusService)
  private userService = inject(UserService)
  public modService = inject(ModalService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  public resetForm!: FormGroup
  public initialFormData: User | null = null

  public message: string = `Dear user, to change the email of your account, you'll need a validation code.
    The code will be sent to your current email, once you press "Send code"...`

  resetCode: string = ''
  codeSent: boolean = false
  timer: number = 0
  resendAvailable: boolean = false
  oldEmail: string = ''

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (this.modService.isModalOpen('reset-email')) {
        this.initializeForm()
        this.oldEmail = user.email
      }
    })
  }

  initializeForm(): void {
    this.resetForm = this.fBuilder.group({
      code: ['', [Validators.required, this.codeValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email],
        [this.formUtilsService.validateField(value =>
          this.userService.validateEmail(value),
          this.initialFormData?.email)]],
    })
  }

  sendCode(): void {
    this.user$.pipe(take(1)).subscribe(user => {
      // Generate and send code
      this.resetCode = this.utilService.generateRandomCode()
      const resetFormData = {
        code: this.resetCode,
        email: user.email,
        username: user.username
      }
      this.emailService.sendResetCodeMail(resetFormData).subscribe({
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
    return control.value === this.resetCode ? null : { codeMismatch: true }
  }

  closeResetModal(): void {
    this.modService.closeModal('reset-email')
    this.resetForm.reset()
    this.codeSent = false
    this.message = `Dear user, to change the email of your account, you'll need a validation code.
      The code will be sent to your current email, once you press "Send code"...`
    this.oldEmail = ''
  }

  onSubmit(): void {
    if (this.resetForm.value.code === this.resetCode) {
      this.user$.pipe(take(1)).subscribe(user => {
        const newEmail = this.resetForm.value.email
        const updatedUser: User = { ...user, email: newEmail }

        this.store.dispatch(UPDATE_USER({ updatedUser }))
        this.notifyUser(user)
      })
    } else showErrorMsg('Failed to Update!',
      'Please try again later', this.eBusService)
  }

  private notifyUser(updatedUser: User): void {
    const updateMailData = {
      username: updatedUser.username,
      email: this.oldEmail
    }
    this.emailService.sendUserUpdatedMail(updateMailData).subscribe({
      next: () => {
        showSuccessMsg('Email Updated!', 'Have a great day!', this.eBusService)
        this.closeResetModal()
      },
      error: (error) => {
        console.error('Error sending password update notification email:', error)
        showErrorMsg('Email Failed!', 'Email was reset without an update email!', this.eBusService)
      }
    })
  }
}