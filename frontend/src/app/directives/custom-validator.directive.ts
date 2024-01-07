import { Directive, Input } from '@angular/core'
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms'

@Directive({
  selector: '[customValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }]
})
export class CustomValidatorDirective implements Validator {
  @Input() cvMaxLength: number = 1000
  @Input() allowedSpecialChars: string = ''

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string

    if (value && value.length > this.cvMaxLength) {
      return { 'maxLength': { 'requiredLength': this.cvMaxLength, 'actualLength': value.length } }
    }

    if (value && !new RegExp(`^[${this.allowedSpecialChars}a-zA-Z0-9]*$`).test(value)) {
      return { 'invalidCharacters': true }
    }

    return null
  }
}