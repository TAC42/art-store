import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalService } from '../../services/modal.service'
import { UserService } from '../../services/user.service'
import { UserSignup } from '../../models/user'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html'
})

export class LoginModalComponent {
  loginForm: FormGroup
  signupForm: FormGroup
  isLoginMode = true

  constructor(public mS: ModalService, private uS: UserService, private fb: FormBuilder) {
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
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        const credentials = this.loginForm.value
        this.uS.login(credentials).subscribe({
          next: (user) => {
            console.log('Logged in user:', user)
            this.closeLoginModal()
          },
          error: (err) => console.error('Login error:', err),
          complete: () => this.loginForm.reset()
        })
      }
    } else {
      if (this.signupForm.valid) {
        const { firstName, lastName, username, email, password } = this.signupForm.value
        const signupData: UserSignup = {
          fullName: `${firstName} ${lastName}`,
          username,
          email,
          imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704381304/PlaceholderImages/evddzhxtr6kropnslvdb.png',
          password
        }
        this.uS.signup(signupData).subscribe({
          next: (user) => {
            console.log('Registered user:', user)
            this.closeLoginModal()
          },
          error: (err) => console.error('Signup error:', err),
          complete: () => this.signupForm.reset()
        })
      }
    }
  }
}
