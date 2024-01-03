import { Component, HostBinding } from '@angular/core'


@Component({
  selector: 'shop',
  templateUrl: './shop.component.html'
})

export class ShopComponent  {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

}