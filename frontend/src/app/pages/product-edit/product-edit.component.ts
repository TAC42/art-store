import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { Observable, Subscription, catchError, debounceTime, distinctUntilChanged, filter, first, map, of, switchMap } from 'rxjs'
import { ShopDbService } from '../../services/shop-db.service'
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { SAVE_PRODUCT } from '../../store/shop.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html'
})

export class ProductEditComponent implements OnInit, OnDestroy {
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.full') fullClass = true
  @ViewChild('nameInput') nameInput!: ElementRef

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private sDbService = inject(ShopDbService)

  private productSubscription: Subscription | undefined

  public editForm!: FormGroup
  public product: Product = ShopDbService.getDefaultProduct()
  public defaultImgUrl: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'
  public specialChars: string = "'. ?$%#!*:,()\"'"

  ngOnInit(): void {
    this.initializeForm()
    this.fetchProductData()
  }

  initializeForm(): void {
    this.editForm = this.fBuilder.group({
      name: [this.product.name || '', [Validators.required], this.nameValidator()],
      price: [this.product.price || '', [Validators.required]],
      description: [this.product.description || '', [Validators.required]],
      dimensions: [this.product.dimensions || '', [Validators.required]],
      materials: [this.product.materials || '', [Validators.required]],
      publishDate: [this.product.publishDate || '', [Validators.required]],
      stock: [this.product.stock || '', Validators.required],
      type: [this.product.type || '', [Validators.required]],
      imgUrls: this.fBuilder.array(this.product.imgUrls?.map(
        url => this.fBuilder.control(url)) || [])
    })
    setTimeout(() => this.nameInput?.nativeElement.focus(), 0)
  }

  fetchProductData(): void {
    this.productSubscription = this.route.data.pipe(
      map(data => data['product']),
      filter(product => !!product)).subscribe(
        product => {
          this.product = product
          this.initializeForm()
        })
  }

  nameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges ||
        control.value === this.product.name) return of(null)

      return control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.validateName(value)),
        first()
      )
    }
  }

  private validateName(value: string): Observable<ValidationErrors | null> {
    if (!value) return of(null)

    return this.sDbService.checkNameAvailable(value).pipe(
      map(response => response.isNameAvailable ? null : { nameTaken: true }),
      catchError(() => of({ error: 'Network or server error' }))
    )
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required!`
    if (field?.errors?.['minLength']) return `${field.errors['minLength'].requiredLength} min characters required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['noNumbersAllowed']) return 'Numbers are not allowed'
    if (field?.errors?.['noLettersAllowed']) return 'Letters are not allowed'
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used!`
    if (field?.errors?.['nameTaken']) return 'This name is already in use!'

    return ''
  }

  get imgUrlsControls(): AbstractControl[] {
    return (this.editForm.get('imgUrls') as FormArray).controls
  }

  addNewImageUploader(): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (imgUrlsArray.length < 5) imgUrlsArray.push(
      this.fBuilder.control(this.defaultImgUrl))
  }

  removeImageUploader(index: number): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (imgUrlsArray.length > 1) imgUrlsArray.removeAt(index)
  }

  handleImageUpload(event: { url: string, index: number }, index: number): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (index < imgUrlsArray.length) imgUrlsArray.at(index).setValue(event.url)
    else imgUrlsArray.push(this.fBuilder.control(event.url))
  }

  onSaveProduct() {
    const formValues = { ...this.editForm.value }
    formValues.name = formValues.name.toLowerCase()

    const productToSave = { ...this.product, ...formValues }
    this.store.dispatch(SAVE_PRODUCT({ product: productToSave }))

    this.router.navigateByUrl(`/${encodeURIComponent(
      this.product.type || 'shop')}`)
  }

  ngOnDestroy(): void {
    if (this.productSubscription) this.productSubscription.unsubscribe()
  }
}
