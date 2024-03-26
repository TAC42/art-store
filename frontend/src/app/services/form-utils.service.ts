import { Injectable, inject } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
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

    if (field.errors['required']) return `${this.toReadableFieldName(fieldName)} is required`

    if (field.errors['email']) return 'Invalid email format'

    if (field.errors['minLength']) return `${field.errors['minLength'].requiredLength} min characters required`

    if (field.errors['maxLength']) return `Maximum length reached`

    if (field.errors['noNumbersAllowed']) return 'Numbers are not allowed'

    if (field.errors['noLettersAllowed']) return 'Letters are not allowed'

    if (field.errors['invalidCharacters']) return `Invalid characters used`

    if (field.errors['nameTaken']) return 'This name is already in use elsewhere'

    if (field.errors['usernameTaken']) return 'This username is already taken'

    if (field.errors['emailTaken']) return 'This email is already taken'

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