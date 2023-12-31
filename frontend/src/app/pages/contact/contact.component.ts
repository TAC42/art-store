import { Component, HostBinding } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

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

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Code to handle form submission, like sending an email
      console.log(this.contactForm.value)
    }
  }
}
