import { Component, HostBinding } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilityService } from '../../services/utility.service'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})

export class ContactComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  paperPlaneIcon: string = 'paperPlaneIcon'
  personIcon: string = 'personIcon'
  emailIcon: string = 'emailIcon'
  titleIcon: string = 'titleIcon'
  descriptionIcon: string = 'descriptionIcon'

  contactImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513247/Gallery/Function/im2hkdn3k8zkrl4oidm5.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703511845/Gallery/Function/zhyc1jbekytmh92gjdea.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ti9l3ndpiq7cwdmwsckx.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ioctdtajxdsqu25eg3s8.png'
  ]

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  recaptchaSize: ReCaptchaV2.Size = 'normal'
  contactForm: FormGroup

  constructor(private fB: FormBuilder,
    private uS: UtilityService,
    private dTS: DeviceTypeService) {
    this.contactForm = this.fB.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.dTS.deviceType$.subscribe(deviceType => {
      this.recaptchaSize = deviceType === 'mobile' ? 'compact' : 'normal'
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required`
    if (field?.errors?.['email']) return 'Invalid email format'

    return ''
  }

  resolved(captchaResponse: string | null) {
    this.isCaptchaResolved = !!captchaResponse
  }

  onSubmit(event: Event) {
    event.preventDefault()
    if (this.contactForm.valid && this.isCaptchaResolved) {
      this.uS.sendMail(this.contactForm.value).subscribe({
        error: (error) => console.error(error),
        complete: () => this.contactForm.reset()
      })
    }
  }
}
