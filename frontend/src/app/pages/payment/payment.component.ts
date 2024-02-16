import { Component, ElementRef, HostBinding, OnInit, ViewChild, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true
  @ViewChild('nameInput') nameInput!: ElementRef

  private fb = inject(FormBuilder)
  private utilService = inject(UtilityService)

  usStates = this.utilService.getStates()

  optionState: string = ''
  payType: string = 'venmo'

  paymentForm: FormGroup
  personalForm!: FormGroup

  constructor() {
    this.paymentForm = this.fb.group({
      paymentMethod: ['venmo']
    })
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(
      value => this.payType = value)
  }

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm(): void {
    this.personalForm = this.fb.group({
      first: ['', Validators.required],
      last: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })
    setTimeout(() => this.nameInput?.nativeElement.focus(), 0)
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personalForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required`
    if (field?.errors?.['email']) return 'Invalid email format'
    if (field?.errors?.['minLength']) return `${field.errors['minLength'].requiredLength} characters required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['length']) return `Phone needs 10 digits`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`

    return ''
  }

  setSelection(option: string) {
    this.optionState = option
  }
}
