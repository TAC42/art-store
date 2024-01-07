import { Directive, Input } from '@angular/core'
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms'

@Directive({
  selector: '[customValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }]
})
export class CustomValidatorDirective implements Validator {
  @Input() maxLength: number = 1000
  @Input() allowedSpecialChars: string = ''

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string

    if (value && value.length > this.maxLength) {
      return { 'maxLength': { 'requiredLength': this.maxLength, 'actualLength': value.length } }
    } // length limit check

    if (value && !new RegExp(`^[${this.allowedSpecialChars}a-zA-Z0-9]*$`).test(value)) {
      return { 'invalidCharacters': true }
    } // special characters check (for sql injections and that)

    return null
  }
}