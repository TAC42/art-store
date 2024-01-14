import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'artware',
  templateUrl: './artware.component.html'
})

export class ArtwareComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true
  
}
