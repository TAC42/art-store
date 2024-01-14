import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})

export class ShopComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

}