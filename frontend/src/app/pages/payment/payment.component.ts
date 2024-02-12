import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true
  optionState: string = ''

  setSelection(option: string){
    this.optionState = option
  }
}
