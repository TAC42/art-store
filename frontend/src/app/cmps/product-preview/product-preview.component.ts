import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { Product } from '../../models/shop'
import { Router } from '@angular/router'

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})

export class ProductPreviewComponent {
  @Input() product!: Product
  @Output() remove = new EventEmitter()
  private router = inject(Router)

  onRemoveProduct(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.remove.emit(this.product._id)
  }
  onEditProduct(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.router.navigateByUrl(`/shop/edit/${encodeURIComponent(this.product.name)}`)
  }
}