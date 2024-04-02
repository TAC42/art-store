import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms'
import { Observable, Subscription, debounceTime, distinctUntilChanged, filter, first, map, of, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { Product } from '../../models/shop'
import { PRODUCT_BY_NAME_LOADED, SAVE_PRODUCT } from '../../store/shop.actions'
import { ShopDbService } from '../../services/shop-db.service'
import { FormUtilsService } from '../../services/form-utils.service'

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html'
})

export class ProductEditComponent implements OnInit, OnDestroy {
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.full') fullClass = true

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private sDbService = inject(ShopDbService)
  private formUtilsService = inject(FormUtilsService)

  private productSubscription: Subscription | undefined

  public formUtils = this.formUtilsService
  public productEditForm!: FormGroup
  public product: Product = ShopDbService.getDefaultProduct()
  public defaultImgUrl: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704997581/PlaceholderImages/oxvsreygp3nxtk5oexwq.jpg'
  public specialChars: string = "'. ?$%#!*:,/()\"'"
  public initialFormData: Product | null = null

  ngOnInit(): void {
    this.initializeForm()
    this.fetchProductData()
  }

  initializeForm(): void {
    this.productEditForm = this.fBuilder.group({
      name: [this.product.name, [Validators.required],
      [this.formUtilsService.validateField(value =>
        this.sDbService.validateProductName(value),
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

  onSaveProduct() {
    const formValues = { ...this.productEditForm.value }
    formValues.name = formValues.name.toLowerCase()

    const productToSave = { ...this.product, ...formValues }
    this.store.dispatch(SAVE_PRODUCT({ product: productToSave }))
    this.store.dispatch(PRODUCT_BY_NAME_LOADED({ product: null }))

    this.router.navigateByUrl(`/${encodeURIComponent(this.product.type || 'shop')}`)
  }

  ngOnDestroy(): void {
    if (this.productSubscription) this.productSubscription.unsubscribe()
  }
}