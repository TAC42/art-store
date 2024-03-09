import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'artware-wrapper',
  templateUrl: './artware.component.html'
})

export class ArtwareComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
}
