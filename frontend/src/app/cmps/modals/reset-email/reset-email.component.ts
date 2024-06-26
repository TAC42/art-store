import { Component, Input, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { User } from '../../../models/user'
import { UPDATE_USER } from '../../../store/user/user.actions'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/utils/event-bus.service'
import { FormUtilsService } from '../../../services/utils/form-utils.service'
import { ModalService } from '../../../services/utils/modal.service'
import { UtilityService } from '../../../services/utils/utility.service'
import { MailService } from '../../../services/api/mail.service'
import { UserService } from '../../../services/api/user.service'

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
      code: ['', [Validators.required, this.formUtilsService.codeValidator(
        () => this.resetCode)]],
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
      this.utilService.sendCodeStartTimer(
        resetFormData, 'sendResetCodeMail',
        (timer, resendAvailable) => {
          this.codeSent = true
          this.message = 'We\'ve sent the code to your email address, please insert it below.'
          this.timer = timer
          this.resendAvailable = resendAvailable
        },
        (error) => { console.error('Failed to send mail:', error) })
    })
  }

  closeResetModal(): void {
    this.modService.closeModal('reset-email')
    this.resetForm.reset()
    this.message = `Dear user, to change the email of your account, you'll need a validation code.
      The code will be sent to your current email, once you press "Send code"...`
    this.codeSent = false
    this.resendAvailable = false
    this.timer = 0
    this.oldEmail = ''
  }

  onSubmit(): void {
    if (this.resetForm.value.code === this.resetCode) {
      this.user$.pipe(take(1)).subscribe(user => {
        const newEmail = this.resetForm.value.email
        const updatedUser: User = { ...user, email: newEmail }

        this.store.dispatch(UPDATE_USER({ updatedUser: updatedUser }))
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