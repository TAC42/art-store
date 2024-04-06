import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { UserSignup } from '../../models/user'
import { SIGNUP } from '../../store/user.actions'
import { FormUtilsService } from '../../services/form-utils.service'
import { ModalService } from '../../services/modal.service'
import { UserService } from '../../services/user.service'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  public modService = inject(ModalService)
  private utilService = inject(UtilityService)
  private userService = inject(UserService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  public signupForm!: FormGroup
  public showPassword: boolean = false
  public allowedSpecialChars: string = '$#@!&*()_+-=[]{}|;:\'",.<>?/~`%^'
  public backgroundImage: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1705592960/vsrpskacudkuu4qjtdvi.png'

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  captchaResponse: string | null = null
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm(): void {
    this.signupForm = this.fBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required],
        [this.formUtilsService.validateField(value =>
          this.userService.validateUsername(value))]],
      email: ['', [Validators.required, Validators.email],
        [this.formUtilsService.validateField(value =>
          this.userService.validateEmail(value))]],
      confirmEmail: ['', [Validators.required, Validators.email,
      this.formUtilsService.confirmField('email')]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required,
      this.formUtilsService.confirmField('password')]]
    })
  }

  openLogin(event: Event) {
    event.stopPropagation()
    this.modService.openModal('login')
  }

  togglePasswordShowing(event: Event): void {
    event.stopPropagation()
    this.showPassword = !this.showPassword
  }

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse
    this.isCaptchaResolved = !!captchaResponse
  }

  onSubmit() {
    if (this.signupForm.valid && this.isCaptchaResolved) {
      const { firstName, lastName, username, email, password } = this.signupForm.value

      const randColor = this.utilService.getRandomMidColor().substring(1)
      let imgUrl = [`https://placehold.co/${100}/${randColor}/ffffff?text=${firstName[0].toUpperCase()}`]

      const credentials: UserSignup = {
        fullName: `${firstName} ${lastName}`, username, email,
        imgUrl, password, recaptchaToken: this.captchaResponse
      }
      this.store.dispatch(SIGNUP({ credentials }))
      // reset of form & recaptcha token
      this.signupForm.reset()
      this.isCaptchaResolved = false
      this.captchaResponse = null
    }
  }
}