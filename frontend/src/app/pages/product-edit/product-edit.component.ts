import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { Subject, filter, map, tap } from 'rxjs'
import { ShopDbService } from '../../services/shop-db.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { nameTaken, startWithNumber } from '../../custom-validators/product-validators'

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private shopDbService = inject(ShopDbService)
  private fb = inject(FormBuilder)

  destroySubject$ = new Subject<void>()
  editForm!: FormGroup
  product: Product = this.shopDbService.getDefaultProduct()
  // @ViewChild('elNameInput') elNameInput!: ElementRef<HTMLInputElement>

  constructor() {
    this.initializeForm()
  }

  ngOnInit(): void {
    this.fetchProductData()
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: [this.product.name || '', [Validators.required]],
      imgUrls: [
        (this.product.imgUrls || []).join(', '), 
        [Validators.required]
      ],
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

  // ngAfterViewInit(): void {
  //   this.elNameInput.nativeElement.focus()
  // }

  onSaveProduct() {
    const productToSave = { ...this.product, ...this.editForm.value }
    console.log('saved product: ', productToSave)
    // this.petService.save(productToSave as Product)
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
