import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})

export class FormUtilsService {
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName)
    if (!field || !field.errors) return ''

    if (field.errors['required']) return `${this.prettyFieldName(fieldName)} is required`

    if (field.errors['email']) return 'Invalid email format'

    if (field.errors['minLength']) {
      return `${field.errors['minLength'].requiredLength} min characters required`
    }

    if (field.errors['maxLength']) return `Maximum length reached`

    if (field.errors['noNumbersAllowed']) return 'Numbers are not allowed'

    if (field.errors['noLettersAllowed']) return 'Letters are not allowed'

    if (field.errors['invalidCharacters']) return `Invalid characters used`

    if (field.errors['nameTaken']) return 'This name is already in use'

    return 'Unknown error' // Fallback error message
  }

  private prettyFieldName(fieldName: string): string {
    // Optionally, implement logic to convert field names to more user-friendly names
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  }
}