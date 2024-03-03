import { Directive, Input } from '@angular/core'
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms'

@Directive({
  selector: '[customValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }]
})

export class CustomValidatorDirective implements Validator {
  @Input() maxLength: number = 1000
  @Input() minLength: number = 1
  @Input() allowedSpecialChars: string = ''
  @Input() allowLetters: boolean = true
  @Input() allowNumbers: boolean = true

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string

    if (value && value.length < this.minLength) {
      return {
        'minLength': {
          'requiredLength':
            this.minLength, 'actualLength': value.length
        }
      }
    } // length min limit check

    if (value && value.length > this.maxLength) {
      return {
        'maxLength': {
          'requiredLength':
            this.maxLength, 'actualLength': value.length
        }
      }
    } // length max limit check

    // Build the regex pattern based on the input properties
    let pattern = '^[' + this.escapeSpecialChars(this.allowedSpecialChars)
    if (this.allowLetters) pattern += 'a-zA-Z'
    if (this.allowNumbers) pattern += '0-9'
    pattern += '\\s]*$'

    // Check for numbers when they're not allowed
    if (!this.allowNumbers && value && /\d/.test(value)) {
      return { 'noNumbersAllowed': true }
    }

    // Check for letters when they're not allowed
    if (!this.allowLetters && value && /[a-zA-Z]/.test(value)) {
      return { 'noLettersAllowed': true }
    }

    // Check for special characters when they're not allowed
    if (value && !new RegExp(pattern).test(value)) {
      return { 'invalidCharacters': true }
    }
    return null
  }

  private escapeSpecialChars(chars: string): string {
    return chars.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
}