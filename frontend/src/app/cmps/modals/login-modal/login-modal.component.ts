import { Component, OnInit, inject } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Observable, debounceTime, distinctUntilChanged, first, of, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { UserCredentials, UserSignup } from '../../../models/user'
import { LOGIN, SIGNUP } from '../../../store/user.actions'
import { ModalService } from '../../../services/modal.service'
import { UtilityService } from '../../../services/utility.service'
import { FormUtilsService } from '../../../services/form-utils.service'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html'
})

export class LoginModalComponent implements OnInit {
  public modService = inject(ModalService)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private utilService = inject(UtilityService)
  private userService = inject(UserService)
  private formUtilsService = inject(FormUtilsService)

  public formUtils = this.formUtilsService
  public loginForm!: FormGroup
  public signupForm!: FormGroup
  public isLoginMode = true

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  captchaResponse: string | null = null
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm(): void {
    this.loginForm = this.fBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
    this.signupForm = this.fBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required], this.usernameValidator()],
      email: ['', [Validators.required, Validators.email], this.emailValidator()],
      password: ['', [Validators.required]]
    })
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges) return of(null)

      return control.valueChanges.pipe(
        debounceTime(500), distinctUntilChanged(), switchMap(value =>
          this.userService.validateUsername(value)), first()
      )
    }
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges) return of(null)

      return control.valueChanges.pipe(
        debounceTime(500), distinctUntilChanged(), switchMap(value =>
          this.userService.validateEmail(value)), first()
      )
    }
  }

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse
    this.isCaptchaResolved = !!captchaResponse
  }

  closeLoginModal() {
    this.modService.closeModal('login')
    this.signupForm.reset()
    this.loginForm.reset()
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid && this.isCaptchaResolved) {
        const { username, password } = this.loginForm.value

        const credentials: UserCredentials = {
          username,
          password,
          recaptchaToken: this.captchaResponse
        }
        this.store.dispatch(LOGIN({ credentials }))
        this.closeLoginModal()
        this.isCaptchaResolved = false
        this.captchaResponse = null
        this.loginForm.reset()
      }
    } else {
      if (this.signupForm.valid && this.isCaptchaResolved) {
        const { firstName, lastName, username, email, password } = this.signupForm.value

        const randColor = this.utilService.getRandomMidColor().substring(1)
        let imgUrl = `https://placehold.co/${100}/${randColor}/ffffff?text=${firstName[0].toUpperCase()}`

        const credentials: UserSignup = {
          fullName: `${firstName} ${lastName}`,
          username,
          email,
          imgUrl,
          password,
          recaptchaToken: this.captchaResponse
        }
        this.store.dispatch(SIGNUP({ credentials }))
        this.closeLoginModal()
        this.isCaptchaResolved = false
        this.captchaResponse = null
        this.signupForm.reset()
      }
    }
  }
}