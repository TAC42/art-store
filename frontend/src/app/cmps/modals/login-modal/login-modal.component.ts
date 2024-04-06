import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { UserLogin } from '../../../models/user'
import { LOGIN } from '../../../store/user.actions'
import { ModalService } from '../../../services/modal.service'
import { FormUtilsService } from '../../../services/form-utils.service'

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html'
})

export class LoginModalComponent implements OnInit {
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  public modService = inject(ModalService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  public loginForm!: FormGroup
  public signupForm!: FormGroup
  public showPassword: boolean = false
  public allowedSpecialChars: string = '$#@!&*()_+-=[]{}|;:\'",.<>?/~`%^'

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  captchaResponse: string | null = null
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm(): void {
    this.loginForm = this.fBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  togglePasswordShowing(event: Event): void {
    event.stopPropagation()
    this.showPassword = !this.showPassword
  }

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse
    this.isCaptchaResolved = !!captchaResponse
  }

  openResetPassword(event: MouseEvent): void {
    event.stopPropagation()
    this.modService.openModal('reset-password')
    this.closeLoginModal()
  }

  closeLoginModal(): void {
    this.modService.closeModal('login')
    this.loginForm.reset()
  }

  onSubmit(): void {
    if (this.loginForm.valid && this.isCaptchaResolved) {
      const { username, password } = this.loginForm.value

      const credentials: UserLogin = {
        username, password, recaptchaToken: this.captchaResponse
      }
      this.store.dispatch(LOGIN({ credentials }))
      // reset of form & recaptcha token
      this.loginForm.reset()
      this.isCaptchaResolved = false
      this.captchaResponse = null
      this.closeLoginModal()
    }
  }
}