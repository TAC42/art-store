import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html'
})

export class PrivacyPolicyComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
}
