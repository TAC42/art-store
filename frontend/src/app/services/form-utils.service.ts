import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})

export class FormUtilsService {
  // general use
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  // general use
  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName)
    if (!field || !field.errors) return ''

    if (field.errors['required']) return `${this.toReadableFieldName(fieldName)} is required`

    if (field.errors['email']) return 'Invalid email format'

    if (field.errors['minLength']) {
      return `${field.errors['minLength'].requiredLength} min characters required`
    }

    if (field.errors['maxLength']) return `Maximum length reached`

    if (field.errors['noNumbersAllowed']) return 'Numbers are not allowed'

    if (field.errors['noLettersAllowed']) return 'Letters are not allowed'

    if (field.errors['invalidCharacters']) return `Invalid characters used`

    if (field.errors['nameTaken']) return 'This name is already in use'

    if (field.errors['codeMismatch']) return 'The code does not match'

    return 'Unknown error' // Fallback error message
  }

  // return a more readable field name relevant to an error message
  private toReadableFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    return words.join(' ')
  }
}