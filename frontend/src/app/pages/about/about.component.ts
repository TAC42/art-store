import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})

export class AboutComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true
}
