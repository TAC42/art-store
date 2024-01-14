import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'app-sculpture',
  templateUrl: './sculpture.component.html'
})

export class SculptureComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

}
