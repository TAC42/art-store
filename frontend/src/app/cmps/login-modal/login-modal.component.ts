import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalService } from '../../services/modal.service'
import { UserService } from '../../services/user.service'
import { UserSignup } from '../../models/user'
import { AppState } from '../../store/app.state'
import { Store } from '@ngrx/store'
import { LOGIN, SIGNUP } from '../../store/user.actions'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html'
})

export class LoginModalComponent {
  loginForm: FormGroup
  signupForm: FormGroup
  isLoginMode = true

  emailIcon: string = 'emailIcon'
  lockIcon: string = 'lockIcon'
  personIcon: string = 'personIcon'
  idIcon: string = 'idIcon'

  constructor(public mS: ModalService, private uS: UserService, private fb: FormBuilder, private store: Store<AppState>) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
    this.signupForm = this.fb.group({
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
    this.mS.closeModal('login')
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

    return ''
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        const credentials = this.loginForm.value
        this.store.dispatch(LOGIN({ credentials }))
        this.closeLoginModal()
        this.loginForm.reset()
        // this.uS.login(credentials).subscribe({
        //   next: (user) => {
        //     console.log('Logged in user:', user)
        //     this.closeLoginModal()
        //   },
        //   error: (err) => console.error('Login error:', err),
        //   complete: () => this.loginForm.reset()
        // })
      }
    } else {
      if (this.signupForm.valid) {
        const { firstName, lastName, username, email, password } = this.signupForm.value
        const credentials: UserSignup = {
          fullName: `${firstName} ${lastName}`,
          username,
          email,
          imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704381304/PlaceholderImages/evddzhxtr6kropnslvdb.png',
          password
        }
        this.store.dispatch(SIGNUP({ credentials }))
        this.closeLoginModal()
        this.signupForm.reset()
        // this.uS.signup(signupData).subscribe({
        //   next: (user) => {
        //     console.log('Registered user:', user)
        //     this.closeLoginModal()
        //   },
        //   error: (err) => console.error('Signup error:', err),
        //   complete: () => this.signupForm.reset()
        // })
      }
    }
  }
}
