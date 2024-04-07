import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { User } from '../../../models/user'
import { LOGOUT } from '../../../store/user.actions'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { FormUtilsService } from '../../../services/form-utils.service'
import { UserService } from '../../../services/user.service'
import { UtilityService } from '../../../services/utility.service'
import { ModalService } from '../../../services/modal.service'
import { MailService } from '../../../services/mail.service'

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private utilService = inject(UtilityService)
  private emailService = inject(MailService)
  private eBusService = inject(EventBusService)
  public modService = inject(ModalService)
  private userService = inject(UserService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  public emailForm!: FormGroup
  public resetForm!: FormGroup
  public showPassword: boolean = false
  public allowedSpecialChars: string = '$#@!&*()_+-=[]{}|;:\'",.<>?/~`%^'

  public message: string = `Dear user, to reset the password of your account,
    please insert your email address.`

  resetCode: string = ''
  codeSent: boolean = false
  timer: number = 0
  resendAvailable: boolean = false

  ngOnInit(): void {
    this.initializeForms()
  }

  initializeForms(): void {
    this.emailForm = this.fBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
    this.resetForm = this.fBuilder.group({
      code: ['', [Validators.required, this.codeValidator.bind(this)]],
      password: ['', [Validators.required]],
    })
  }

  onSubmitEmail(): void {
    if (this.emailForm.valid) { // Generate and send code
      this.resetCode = this.utilService.generateRandomCode()
      const resetFormData = {
        code: this.resetCode,
        email: this.emailForm.value.email,
      }
      this.utilService.sendCodeStartTimer(
        resetFormData,
        'sendResetCodeMail',
        (timer, resendAvailable) => {
          this.codeSent = true
          this.message = 'We\'ve sent the code to your email address, please insert it below.'
          this.timer = timer
          this.resendAvailable = resendAvailable
        },
        (error) => { console.error('Failed to send mail:', error) })
    }
  }

  codeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null
    return control.value === this.resetCode ? null : { codeMismatch: true }
  }

  togglePasswordShowing(event: Event): void {
    event.stopPropagation()
    this.showPassword = !this.showPassword
  }

  closeResetModal(): void {
    this.modService.closeModal('reset-password')
    this.emailForm.reset()
    this.resetForm.reset()
    this.message = `Dear user, to reset the password of your account,
      please insert your email address.`
    this.codeSent = false
    this.resendAvailable = false
    this.timer = 0
  }

  onSubmitReset(): void {
    if (this.resetForm.valid) {
      const { code, password } = this.resetForm.value
      if (code !== this.resetCode) return

      this.userService.getByEmail(this.emailForm.value.email).subscribe({
        next: (user: User) => {
          const updatedUser: User = { ...user, password }
          this.updatePassword(updatedUser)
        },
        error: (error) => console.error('Error fetching user:', error),
      })
    }
  }

  private updatePassword(updatedUser: User): void {
    this.userService.save(updatedUser).subscribe({
      next: () => this.notifyUser(updatedUser),
      error: (error) => {
        showErrorMsg('Reset Failed!', 'Please try again later...', this.eBusService)
        console.error('Error resetting password:', error)
      },
    })
  }

  private notifyUser(updatedUser: User): void {
    const updateMailData = {
      username: updatedUser.username,
      email: updatedUser.email
    }
    this.emailService.sendUserUpdatedMail(updateMailData).subscribe({
      next: () => {
        showSuccessMsg('Password Reset!', 'Please login with the new password', this.eBusService)
        this.logoutUser()
      },
      error: (error) => {
        console.error('Error sending password update notification email:', error)
        showErrorMsg('Email Failed!', 'Password was reset without an update email!', this.eBusService)
        this.logoutUser()
      }
    })
  }

  private logoutUser(): void {
    this.closeResetModal()
    this.store.dispatch(LOGOUT())
    setTimeout(() => this.router.navigate(['/']), 3000)
  }
}