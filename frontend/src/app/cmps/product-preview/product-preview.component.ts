import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Product } from '../../models/shop'

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})

export class ProductPreviewComponent {
  @Input() product!: Product
  @Output() remove = new EventEmitter()

  onRemoveProduct() {
    this.remove.emit(this.product._id)
  }
}