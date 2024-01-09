import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { Subject, filter, map, tap } from 'rxjs'
import { ShopDbService } from '../../services/shop-db.service'
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { nameTaken, startWithNumber } from '../../custom-validators/product-validators'
import { SAVE_PRODUCT } from '../../store/shop.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private shopDbService = inject(ShopDbService)
  private fb = inject(FormBuilder)
  imgExtensions = ['png', 'jpeg']

  destroySubject$ = new Subject<void>()
  editForm!: FormGroup
  product: Product = this.shopDbService.getDefaultProduct()
  // @ViewChild('elNameInput') elNameInput!: ElementRef<HTMLInputElement>

  constructor(private store: Store<AppState>) {
    this.initializeForm()
  }


  ngOnInit(): void {
    this.fetchProductData()
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: [this.product.name || '', [Validators.required]],
      // imgUrls: [
      //   (this.product.imgUrls || []).join(','),
      //   [Validators.required]
      // ],
      imgUrls: this.fb.array([this.createFileControl()], [this.validateFileExtensions()]),
      price: [this.product.price || '', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      description: [
        this.product.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(150)],
      ],
      inStock: [this.product.inStock || true, Validators.required],
      type: [this.product.type || '', [Validators.required, Validators.pattern(/^(shop|sculpture|artware)$/)]],
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
        console.log('This is edit ', product)
      })
  }

  createFileControl(): FormGroup {
    return this.fb.group({
      file: ['', [Validators.required]]
    })
  }

  validateFileExtensions(): ValidatorFn {
    return (control: AbstractControl): { invalidExtension: boolean } | null => {
      const formArray = control as FormArray

      for (const control of formArray.controls) {
        const fileControl = control as FormGroup;
        const file = fileControl.get('file')

        if (file && file.value) {
          const fileName = file.value.name
          const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

          if (fileExtension !== 'png' && fileExtension !== 'jpeg' && fileExtension !== 'jpg') {
            return { invalidExtension: true }
          }
        }
      }

      return null
    }
  }

  public imgUrlsFormArray: FormArray = this.fb.array([])

  addImage() {
    this.imgUrlsFormArray.push(this.fb.control(''))
  }

  // Function to remove an image input
  removeImage(index: number) {
    if (this.imgUrlsFormArray.length > 1) {
      this.imgUrlsFormArray.removeAt(index);
    }
  }

  isRemove(index: number): boolean {
    return index > 0;
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      if (file.size <= 4 * 1024 * 1024) { // Checking file size (4MB in bytes)
        const imgUrlsFormArray = this.editForm.get('imgUrls') as FormArray
        const fileControl = imgUrlsFormArray.at(index).get('file')
        if (fileControl) {
          fileControl.patchValue(file)
        }
      } else {     
        alert('File size exceeds 4MB limit!')
        input.value = ''
      }
    }
  }


  onSaveProduct() {
    const imgUrls = this.editForm.value.imgUrls
    const imgUrlsArray = imgUrls.includes(',')
      ? imgUrls.trim(' ').split(',').map((url: string) => url.trim())
      : [imgUrls.trim(' ')]

    const productToSave = {
      ...this.product,
      ...this.editForm.value,
      imgUrls: imgUrlsArray,
    }
    console.log('saved product: ', productToSave)
    this.store.dispatch(SAVE_PRODUCT({ product: productToSave }))
    this.router.navigateByUrl(`/${encodeURIComponent(this.product.type)}`)
  }


  formatTime(date: Date | number | string) {
    return new Date(date).toISOString().slice(0, 10)
  }

  getErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName)
    if (field?.errors?.['required']) return `${fieldName} is required!`
    if (field?.errors?.['pattern']) return `Please enter a valid ${fieldName}!`
    if (field?.errors?.['minlength']) return `Minlength 10 chars!`
    if (field?.errors?.['maxlength']) return `Maxlength 150 chars!`
    return ''
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName)
    return field ? field.invalid && (field.dirty || field.touched) : false
  }

  onBack = () => {
    this.router.navigateByUrl(`/${encodeURIComponent(this.product.type)}`)
  }

  ngOnDestroy(): void {
    this.destroySubject$.next()
  }
}
