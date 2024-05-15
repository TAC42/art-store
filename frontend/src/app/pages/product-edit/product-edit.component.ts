import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription, filter, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { Product } from '../../models/product'
import { SAVE_PRODUCT } from '../../store/product/product.actions'
import { ProductService } from '../../services/api/product.service'
import { FormUtilsService } from '../../services/utils/form-utils.service'

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html',
  host: { 'class': 'full w-h-100' }
})

export class ProductEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private prodService = inject(ProductService)
  private formUtilsService = inject(FormUtilsService)

  private productSubscription: Subscription | undefined

  public formUtils = this.formUtilsService
  public productEditForm!: FormGroup
  public product: Product = ProductService.getDefaultProduct()
  public defaultImgUrl: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'
  public specialCharsFull: string = `!@#$%*()"':;/,.-=+ `
  public specialCharsLimited: string = `"':/,. `
  public initialFormData: Product | null = null

  ngOnInit(): void {
    this.initializeForm()
    this.fetchProductData()
  }

  initializeForm(): void {
    this.productEditForm = this.fBuilder.group({
      name: [this.product.name, [Validators.required],
      [this.formUtilsService.validateField(value =>
        this.prodService.validateProductName(value),
        this.initialFormData?.name)]],
      price: [this.product.price, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      dimensions: [this.product.dimensions, [Validators.required]],
      materials: [this.product.materials, [Validators.required]],
      dateMade: [this.product.dateMade, [Validators.required]],
      stock: [this.product.stock, Validators.required],
      type: [this.product.type, [Validators.required]],
      imgUrls: this.fBuilder.array(this.product.imgUrls?.map(
        url => this.fBuilder.control(url)))
    })
  }

  fetchProductData(): void {
    this.productSubscription = this.route.data.pipe(
      map(data => data['product']),
      filter(product => !!product)).subscribe(product => {
        this.product = product
        this.initialFormData = product
        this.initializeForm()
      })
  }

  get imgUrlsControls(): AbstractControl[] {
    return (this.productEditForm.get('imgUrls') as FormArray).controls
  }

  addNewImgUploader(): void {
    this.formUtils.addNewImageUploader(this.productEditForm, this.defaultImgUrl, 'imgUrls')
  }

  removeImgUploader(index: number): void {
    this.formUtils.removeImageUploader(this.productEditForm, index, 'imgUrls')
  }

  handleImgUpload(event: { url: string, index: number, controlName: string }): void {
    this.formUtils.handleImageUpload(this.productEditForm, event)
  }

  onSaveProduct(): void {
    const formValues = { ...this.productEditForm.value }
    formValues.name = formValues.name.toLowerCase()

    const productToSave = { ...this.product, ...formValues }
    this.store.dispatch(SAVE_PRODUCT({ product: productToSave }))

    this.router.navigateByUrl(`/${encodeURIComponent(this.product.type || 'shop')}`)
  }

  ngOnDestroy(): void {
    if (this.productSubscription) this.productSubscription.unsubscribe()
  }
}