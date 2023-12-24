import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Product } from '../../models/shop'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})
export class ProductPreviewComponent {
  @Input() product!: Product
  @Output() remove = new EventEmitter()
  prodImg: string = ''

  constructor(private http: HttpClient) {
    this.fetchRandomImage()
  }

  fetchRandomImage() {
    const uniqueId = Math.floor(Math.random() * 1000)
    this.prodImg = `https://picsum.photos/100/150?random=${uniqueId}`
  }

  onRemoveProduct() {
    this.remove.emit(this.product._id)
  }
}