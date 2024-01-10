import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { Subject, filter, map } from 'rxjs'
import { ShopDbService } from '../../services/shop-db.service'
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SAVE_PRODUCT } from '../../store/shop.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html'
})

export class ProductEditComponent implements OnInit, OnDestroy {
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)

  destroySubject$ = new Subject<void>()
  editForm!: FormGroup
  product: Product = ShopDbService.getDefaultProduct()
  defaultImgUrl: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/w9ukn7dnssrdxgksfxgk.png'

  constructor() {
    this.initializeForm()
  }

  ngOnInit(): void {
    this.fetchProductData()
  }

  initializeForm(): void {
    this.editForm = this.fBuilder.group({
      name: [this.product.name || '', [Validators.required]],
      price: [this.product.price || '', [Validators.required]],
      description: [this.product.description || '', [Validators.required]],
      inStock: [this.product.inStock || true, Validators.required],
      type: [this.product.type || '', [Validators.required]],
      imgUrls: this.fBuilder.array(this.product.imgUrls?.map(url => this.fBuilder.control(url)) || [])
    })
  }

  fetchProductData(): void {
    this.route.data
      .pipe(
        map(data => data['product']),
        filter(product => !!product)
      )
      .subscribe(product => {
        this.product = product
        this.initializeForm()
        // console.log('This is edit ', product)
      })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  getErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required!`
    if (field?.errors?.['minLength']) return `${field.errors['minLength'].requiredLength} characters required`
    if (field?.errors?.['maxLength']) return `Maximum length reached`
    if (field?.errors?.['invalidCharacters']) return `Invalid characters used`

    return ''
  }

  get imgUrlsControls(): AbstractControl[] {
    return (this.editForm.get('imgUrls') as FormArray).controls
  }

  addNewImageUploader(): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (imgUrlsArray.length < 5) imgUrlsArray.push(this.fBuilder.control(this.defaultImgUrl))
  }

  handleImageUpload(event: { url: string, index: number }, index: number): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (index < imgUrlsArray.length) imgUrlsArray.at(index).setValue(event.url)
    else imgUrlsArray.push(this.fBuilder.control(event.url))
  }

  onSaveProduct() {
    const productToSave = {
      ...this.product,
      ...this.editForm.value
    }
    console.log('saved product: ', productToSave)
    this.store.dispatch(SAVE_PRODUCT({ product: productToSave }))
    this.router.navigateByUrl(`/${encodeURIComponent(this.product.type)}`)
  }

  ngOnDestroy(): void {
    this.destroySubject$.next()
  }

  onBack = () => {
    this.router.navigateByUrl(`/${encodeURIComponent(this.product.type)}`)
  }
}
