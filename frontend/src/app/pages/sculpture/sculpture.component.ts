import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'sculpture-wrapper',
  templateUrl: './sculpture.component.html'
})

export class SculptureComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
}
