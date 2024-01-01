import { Component, HostBinding } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})

export class ContactComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  paperPlaneIcon: string = 'paperPlaneIcon'
  personIcon: string = 'personIcon'
  emailIcon: string = 'emailIcon'
  titleIcon: string = 'titleIcon'
  descriptionIcon: string = 'descriptionIcon'

  loneImg: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703511845/Gallery/Function/zhyc1jbekytmh92gjdea.png'

  contactForm: FormGroup

  constructor(private formBuilder: FormBuilder, private utilityService: UtilityService) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName)
    if (field?.errors?.['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    }
    if (field?.errors?.['email']) return 'Invalid email format'

    return ''
  }

  resetForm() {
    this.contactForm.reset({
      name: '',
      email: '',
      title: '',
      message: ''
    })
  }

  onSubmit(event: Event) {
    event.preventDefault()
    if (this.contactForm.valid) {
      this.utilityService.sendMail(this.contactForm.value).subscribe({
        error: (error) => {
          console.error(error)
        },
        complete: () => {
          this.resetForm()
        }
      })
    }
  }
}
