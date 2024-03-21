import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { User } from '../../models/user'
import { FormUtilsService } from '../../services/form-utils.service'
import { UtilityService } from '../../services/utility.service'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private fBuilder = inject(FormBuilder)
  private utilService = inject(UtilityService)
  private userService = inject(UserService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  emailForm!: FormGroup
  resetForm!: FormGroup

  public message: string = 'Dear user, to reset the password of your account, please insert your email address.'
  resetCode: string = ''
  codeSent: boolean = false
  timer: number = 0
  resendAvailable: boolean = false

  ngOnInit() {
    this.initializeForms()
  }

  initializeForms(): void {
    this.emailForm = this.fBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
    this.resetForm = this.fBuilder.group({
      code: ['', [Validators.required, this.codeValidator.bind(this)]],
      newPassword: ['', [Validators.required]],
    })
  }

  onSubmitEmail() {
    if (this.emailForm.valid) {
      // Generate and send code
      const email = this.emailForm.value.email
      this.resetCode = this.utilService.generateRandomCode()
      const resetFormData = {
        code: this.resetCode,
        email: email,
      }
      this.utilService.sendResetPasswordMail(resetFormData).subscribe({
        next: () => {
          this.codeSent = true
          this.message = 'A reset code has been sent to your email.'
          this.resendAvailable = false
          this.utilService.startResendTimer().subscribe({
            next: ({ timer, resendAvailable }) => {
              this.timer = timer
              this.resendAvailable = resendAvailable
            }
          })
        },
        error: (error) => {
          this.message = 'Failed to send reset code. Please try again.'
          console.error('Error sending reset code:', error)
        },
      })
    }
  }

  codeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null
    return control.value === this.resetCode ? null : { codeMismatch: true }
  }

  onSubmitReset() {
    if (this.resetForm.valid) {
      const { code, newPassword } = this.resetForm.value

      if (code !== this.resetCode) {
        this.message = 'Invalid reset code.'
        console.error('Error verifying reset code: Code does not match')
        return
      }
      this.userService.getByEmail(this.emailForm.value.email).subscribe({
        next: (user: User) => {
          const updatedUser: User = { ...user, password: newPassword }

          this.userService.save(updatedUser).subscribe({
            next: () => {
              this.message = 'Your password has been successfully reset.'
              this.resetForms()
            },
            error: (error) => {
              this.message = 'Failed to reset password. Please try again.'
              console.error('Error resetting password:', error)
            },
          })
        },
        error: (error) => {
          this.message = 'Failed to find user. Please try again.'
          console.error('Error fetching user:', error)
        },
      })
    }
  }

  private resetForms(): void {
    this.emailForm.reset()
    this.resetForm.reset()
    this.codeSent = false
    this.message = 'Dear user, to reset the password of your account, please insert your email address.'
  }
}
