import { Component, HostBinding } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilityService } from '../../services/utility.service'
import { DeviceTypeService } from '../../services/device-type.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

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
  contactForm: FormGroup

  contactImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513247/Gallery/Function/im2hkdn3k8zkrl4oidm5.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703511845/Gallery/Function/zhyc1jbekytmh92gjdea.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ti9l3ndpiq7cwdmwsckx.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ioctdtajxdsqu25eg3s8.png'
  ]

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  constructor(private fBuilder: FormBuilder,
    private uS: UtilityService,
    private dTS: DeviceTypeService,
    private eBusService: EventBusService) {
    this.contactForm = this.fBuilder.group({
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
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`

    return ''
  }

  resolved(captchaResponse: string | null) {
    this.isCaptchaResolved = !!captchaResponse
  }

  onSubmit(event: Event) {
    event.preventDefault()
    if (this.contactForm.valid && this.isCaptchaResolved) {
      this.uS.sendMail(this.contactForm.value).subscribe({
        next: () => {
          showSuccessMsg('Email Sent!',
            'Thank you for contacting!', this.eBusService)
          this.contactForm.reset()
        },
        error: (error) => {
          console.error(error)
          showErrorMsg('Email Failed!',
            'Please try again later...', this.eBusService)
        }
      })
    }
  }
}
