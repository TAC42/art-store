import { Component, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true
  optionState: string = ''
  payType: string = 'venmo'
  
  paymentForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['venmo']
    })

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.payType = value
    })
  }

  setSelection(option: string){
    this.optionState = option
  }
}
