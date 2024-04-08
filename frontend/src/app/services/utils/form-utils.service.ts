import { Injectable, inject } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms'
import { Observable, debounceTime, distinctUntilChanged, first, map, of, switchMap } from 'rxjs'
import { UtilityService } from './utility.service'

@Injectable({
  providedIn: 'root'
})

export class FormUtilsService {
  private fBuilder = inject(FormBuilder)
  private utilService = inject(UtilityService)

  // general use
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  // general use
  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName)
    if (!field || !field.errors) return ''

    if (field.errors['required']) return `${this.toReadableFieldName(fieldName)} is required!`

    if (field.errors['email']) return 'Invalid email format!'

    if (field.errors['minLength']) return `${field.errors['minLength'].requiredLength} min characters required!`

    if (field.errors['maxLength']) return `Maximum length reached!`

    if (field.errors['noNumbersAllowed']) return 'Numbers are not allowed!'

    if (field.errors['noLettersAllowed']) return 'Letters are not allowed!'

    if (field.errors['invalidCharacters']) return `Invalid characters used!`

    if (field.errors['nameTaken']) return 'Product Name already in use!'

    if (field.errors['usernameTaken']) return 'Username already in use!'

    if (field.errors['emailTaken']) return 'Email already in use!'

    if (field.errors['codeMismatch']) return 'The code does not match!'

    if (field.errors['uppercaseRequired']) return 'Password missing an uppercase letter!'

    if (field.errors['lowercaseRequired']) return 'Password missing an lowercase letter!'

    if (field.errors['numberRequired']) return 'Password missing a number!'

    if (field.errors['specialCharRequired']) return 'Password missing a special character!'

    if (field.errors['emailMismatch']) return `Emails don't match!`

    if (field.errors['passwordMismatch']) return `Passwords don't match!`

    return 'Unknown error' // Fallback error message
  }

  // return a more readable field name relevant to an error message
  private toReadableFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    return words.join(' ')
  }

  // confirm if certain input is available for use in a form
  validateField(validateFn: (value: string) => Observable<any>, initialValue?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges || control.value === initialValue) {
        return of(null)
      }
      return control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => validateFn(value)),
        first()
      )
    }
  }

  // confirm if certain input's contents match the contents of another similar input
  confirmField(matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null

      const matchingControl = control.parent.get(matchingControlName)
      const confirmControl = control

      if (!matchingControl || !confirmControl) return null
      if (matchingControl.value !== confirmControl.value) {
        return { [`${matchingControlName}Mismatch`]: true }
      }
      return null
    }
  }

  // Used for validating special code sent to user's email address
  codeValidator(getExpectedCode: () => string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null
      const expectedCode = getExpectedCode()
      return control.value === expectedCode ? null : { codeMismatch: true }
    }
  }

  // Check if form has changed before bothering to allow saving changes
  isFormUnchanged<T>(form: FormGroup, initialData: T | null): boolean {
    if (!initialData) return false

    const formData = form.value
    const initialDataObject = initialData as { [key: string]: any }

    const relevantInitialData = Object.keys(formData).reduce(
      (obj: { [key: string]: any }, key) => {
        if (key in initialDataObject) obj[key] = initialDataObject[key]
        return obj
      }, {})
    return this.utilService.deepEqual(formData, relevantInitialData)
  }

  // handling of image uploaders count and upload of images
  addNewImageUploader(form: FormGroup, defaultImgUrl: string, controlName: string): void {
    const imgUrlsArray = form.get(controlName) as FormArray
    if (imgUrlsArray.length < 5) imgUrlsArray.push(this.fBuilder.control(defaultImgUrl))
  }

  removeImageUploader(form: FormGroup, index: number, controlName: string): void {
    const imgUrlsArray = form.get(controlName) as FormArray
    if (imgUrlsArray.length > index) imgUrlsArray.removeAt(index)
  }

  handleImageUpload(form: FormGroup, event: { url: string, index: number, controlName: string }): void {
    const { url, index, controlName } = event

    const imgUrlsArray = form.get(controlName) as FormArray
    if (index < imgUrlsArray.length) imgUrlsArray.at(index).setValue(url)
    else imgUrlsArray.push(this.fBuilder.control(url))
  }
}