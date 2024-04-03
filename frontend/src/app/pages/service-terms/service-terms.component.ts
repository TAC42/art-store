import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'service-terms',
  templateUrl: './service-terms.component.html'
})

export class ServiceTermsComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
}
