import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { CarouselItem, ContactUsRequestBody } from '../../../models/utility'
import { UtilityService } from '../../../services/utils/utility.service'
import { FormUtilsService } from '../../../services/utils/form-utils.service'
import { DeviceTypeService } from '../../../services/utils/device-type.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/utils/event-bus.service'
import { MailService } from '../../../services/api/mail.service'

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  host: { 'class': 'layout-row w-h-100' }
})

export class ContactComponent implements OnInit {
  private fBuilder = inject(FormBuilder)
  private utilService = inject(UtilityService)
  private emailService = inject(MailService)
  private formUtilsService = inject(FormUtilsService)
  private dTypeService = inject(DeviceTypeService)
  private eBusService = inject(EventBusService)

  public regularUtils = this.utilService
  public formUtils = this.formUtilsService
  public contactForm!: FormGroup
  public specialCharsFull = `!@#$%*()"':;/,.-=+ `

  public carouselItems: CarouselItem[] = []
  public contactImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716234077/Sculpture/h9qediuxfaeipa4oaxrv.avif',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716238673/Artware/qnybnp5mqb0tsagaelp8.avif',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716237619/Artware/jgqg9ntqcachua8ylzis.avif',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716238019/Artware/wgarv8cz2zr0xqq64po8.avif'
  ]
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  captchaResponse: string | null = null
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  ngOnInit(): void {
    this.deviceType$.subscribe(deviceType => {
      if (deviceType === 'mobile') this.recaptchaSize = 'compact'
      else this.recaptchaSize = 'normal'
    })
    this.initializeForm()
    this.carouselItems = this.utilService.convertToCarouselItem(this.contactImageUrls)
  }

  initializeForm(): void {
    this.contactForm = this.fBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  resolved(captchaResponse: string | null): void {
    this.captchaResponse = captchaResponse
    this.isCaptchaResolved = !!captchaResponse
  }

  onSubmit(): void {
    if (this.contactForm.valid && this.isCaptchaResolved) {
      const formDataWithCaptcha: ContactUsRequestBody = {
        ...this.contactForm.value, recaptchaToken: this.captchaResponse
      }
      this.emailService.sendContactUsMail(formDataWithCaptcha).subscribe({
        next: () => {
          // reset of form & recaptcha token
          this.contactForm.reset()
          this.isCaptchaResolved = false
          this.captchaResponse = null
          showSuccessMsg('Email Sent!', 'Thank you for contacting us!', this.eBusService)
        },
        error: (error) => {
          console.error(error)
          showErrorMsg('Email Failed!', 'Please try again later...', this.eBusService)
        }
      })
    }
  }
}