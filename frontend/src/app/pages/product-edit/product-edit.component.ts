import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  Observable, Subscription, catchError, debounceTime,
  distinctUntilChanged, filter, first, map, of, switchMap
} from 'rxjs'
import {
  AbstractControl, AsyncValidatorFn, FormArray, FormBuilder,
  FormGroup, ValidationErrors, Validators
} from '@angular/forms'
import { ShopDbService } from '../../services/shop-db.service'
import { FormUtilsService } from '../../services/form-utils.service'
import { Product } from '../../models/shop'
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

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fBuilder = inject(FormBuilder)
  private store = inject(Store<AppState>)
  private sDbService = inject(ShopDbService)
  private formUtilsService = inject(FormUtilsService)

  private productSubscription: Subscription | undefined

  public formUtils = this.formUtilsService
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
      name: [this.product.name, [Validators.required], this.nameValidator()],
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
        this.initializeForm()
      })
  }

  nameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges ||
        control.value === this.product.name) return of(null)

      return control.valueChanges.pipe(
        debounceTime(500), distinctUntilChanged(),
        switchMap(value => this.validateName(value)), first()
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

  get imgUrlsControls(): AbstractControl[] {
    return (this.editForm.get('imgUrls') as FormArray).controls
  }

  addNewImageUploader(): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (imgUrlsArray.length < 5) imgUrlsArray.push(this.fBuilder.control(this.defaultImgUrl))

    this.editForm.setControl('imgUrls', this.fBuilder.array(imgUrlsArray.controls))
  }

  removeImageUploader(index: number): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    imgUrlsArray.removeAt(index)
    this.editForm.setControl('imgUrls', this.fBuilder.array(imgUrlsArray.controls))
  }

  handleImageUpload(event: { url: string, index: number }, index: number): void {
    const imgUrlsArray = this.editForm.get('imgUrls') as FormArray
    if (index < imgUrlsArray.length) imgUrlsArray.at(index).setValue(event.url)
    else imgUrlsArray.push(this.fBuilder.control(event.url))

    this.editForm.setControl('imgUrls', this.fBuilder.array(imgUrlsArray.controls))
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