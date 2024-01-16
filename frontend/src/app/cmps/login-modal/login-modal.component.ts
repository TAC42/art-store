import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalService } from '../../services/modal.service'
import { UserSignup } from '../../models/user'
import { AppState } from '../../store/app.state'
import { Store } from '@ngrx/store'
import { LOGIN, SIGNUP } from '../../store/user.actions'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html'
})

export class LoginModalComponent {
  public modService = inject(ModalService)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private utilService = inject(UtilityService)

  loginForm: FormGroup
  signupForm: FormGroup
  isLoginMode = true

  constructor() {
    this.loginForm = this.fBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
    this.signupForm = this.fBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode
  }

  closeLoginModal() {
    this.modService.closeModal('login')
    this.signupForm.reset()
    this.loginForm.reset()
  }

  isFieldInvalid(fieldName: string): boolean {
    const form = this.isLoginMode ? this.loginForm : this.signupForm
    const field = form.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const form = this.isLoginMode ? this.loginForm : this.signupForm
    const field = form.get(fieldName)
    if (field?.errors?.['required']) {
      if (fieldName === 'firstName') return 'first name is required'
      else if (fieldName === 'lastName') return 'last name is required'
      else return `${fieldName} is required`
    }
    if (field?.errors?.['email']) return 'Invalid email format'
    if (field?.errors?.['minLength']) return `${field.errors['minLength'].requiredLength} characters required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`

    return ''
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        const credentials = this.loginForm.value
        this.store.dispatch(LOGIN({ credentials }))
        this.closeLoginModal()
        this.loginForm.reset()
      }
    } else {
      if (this.signupForm.valid) {
        const { firstName, lastName, username, email, password } = this.signupForm.value

        const randColor = this.utilService.getRandomMidColor().substring(1)
        let imgUrl = `https://placehold.co/${100}/${randColor}/ffffff?text=${firstName[0].toUpperCase()}`

        const credentials: UserSignup = {
          fullName: `${firstName} ${lastName}`,
          username,
          email,
          imgUrl,
          password
        }
        this.store.dispatch(SIGNUP({ credentials }))
        this.closeLoginModal()
        this.signupForm.reset()
      }
    }
  }
}
