import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { CarouselItem } from '../../../models/shop'
import { UtilityService } from '../../../services/utility.service'
import { FormUtilsService } from '../../../services/form-utils.service'
import { DeviceTypeService } from '../../../services/device-type.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html'
})

export class ContactComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private dTypeService = inject(DeviceTypeService)
  private eBusService = inject(EventBusService)
  private fBuilder = inject(FormBuilder)
  private utilService = inject(UtilityService)
  private formUtilsService = inject(FormUtilsService)

  public regularUtils = this.utilService
  public formUtils = this.formUtilsService
  public contactForm!: FormGroup
  public specialChars = "'. ?$%#!*:,/()\"'"

  public carouselItems: CarouselItem[] = []
  public contactImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880473/Artware/r0vaet9gmlapbshf6hb1.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/pqiuffqnaa7gmznrsnmy.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/h9adgfdphiip2xujdm4d.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/kuglbewtdm4pc7sr2dct.png'
  ]
  deviceType$: Observable<string> = this.dTypeService.deviceType$

  siteKey: string = '6LdnmEIpAAAAACZzpdSF05qOglBB7fI41OP0cQ0V'
  isCaptchaResolved: boolean = false
  captchaResponse: string | null = null
  recaptchaSize: ReCaptchaV2.Size = 'normal'

  ngOnInit() {
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

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse
    this.isCaptchaResolved = !!captchaResponse
  }

  onSubmit() {
    if (this.contactForm.valid && this.isCaptchaResolved) {
      const formDataWithCaptcha = {
        ...this.contactForm.value,
        recaptchaToken: this.captchaResponse
      }
      this.utilService.sendContactUsMail(formDataWithCaptcha).subscribe({
        next: () => {
          showSuccessMsg('Email Sent!',
            'Thank you for contacting!', this.eBusService)
          // reset of form & recaptcha token
          this.contactForm.reset()
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