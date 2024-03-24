import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { User } from '../../models/user'
import { LOGOUT } from '../../store/user.actions'
import { FormUtilsService } from '../../services/form-utils.service'
import { UtilityService } from '../../services/utility.service'
import { UserService } from '../../services/user.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private utilService = inject(UtilityService)
  private eBusService = inject(EventBusService)
  private userService = inject(UserService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  emailForm!: FormGroup
  resetForm!: FormGroup
  public allowedSpecialChars: string = '$#@!&*()_+-=[]{}|;:\'",.<>?/~`%^'

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
      password: ['', [Validators.required]],
    })
  }

  onSubmitEmail() {
    if (this.emailForm.valid) {
      // Generate and send code
      this.resetCode = this.utilService.generateRandomCode()
      const resetFormData = {
        code: this.resetCode,
        email: this.emailForm.value.email,
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
          showErrorMsg('Email Failed!',
            'We were\'nt able to send the code!', this.eBusService)
          console.error('Error sending code:', error)
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
      const { code, password } = this.resetForm.value
      if (code !== this.resetCode) return

      this.userService.getByEmail(this.emailForm.value.email).subscribe({
        next: (user: User) => {
          const updatedUser: User = { ...user, password }

          this.userService.save(updatedUser).subscribe({
            next: () => {
              this.emailForm.reset()
              this.resetForm.reset()
              this.codeSent = false
              showSuccessMsg('Password Reset!', 'Please login with the new password.',
                this.eBusService)
              this.store.dispatch(LOGOUT())
              setTimeout(() => this.router.navigate(['/']), 3000)
            },
            error: (error) => {
              showErrorMsg('Reset Failed!',
                'Please try again later', this.eBusService)
              console.error('Error resetting password:', error)
            },
          })
        },
        error: (error) => console.error('Error fetching user:', error),
      })
    }
  }
}
