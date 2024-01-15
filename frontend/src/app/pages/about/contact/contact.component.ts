import { Component, HostBinding, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilityService } from '../../../services/utility.service'
import { DeviceTypeService } from '../../../services/device-type.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})

export class ContactComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private uS = inject(UtilityService)
  private dTS = inject(DeviceTypeService)
  private eBusService = inject(EventBusService)
  private fBuilder = inject(FormBuilder)

  contactForm: FormGroup

  contactImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880473/Artware/r0vaet9gmlapbshf6hb1.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/pqiuffqnaa7gmznrsnmy.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/h9adgfdphiip2xujdm4d.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/kuglbewtdm4pc7sr2dct.png'
  ]

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  captchaResponse: string | null = null
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  constructor() {
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
    if (field?.errors?.['minLength']) return `${field.errors['minLength'].requiredLength} characters required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`

    return ''
  }

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse
    this.isCaptchaResolved = !!captchaResponse
  }

  onSubmit(event: Event) {
    event.preventDefault()
    if (this.contactForm.valid && this.isCaptchaResolved) {
      // Add the recaptcha response to the form, to be sent to backend
      const formDataWithCaptcha = {
        ...this.contactForm.value,
        recaptchaToken: this.captchaResponse
      }

      this.uS.sendMail(formDataWithCaptcha).subscribe({
        next: () => {
          showSuccessMsg('Email Sent!',
            'Thank you for contacting!', this.eBusService)
          this.contactForm.reset()
          // reset of recaptcha token
          this.isCaptchaResolved = false
          this.captchaResponse = null
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
