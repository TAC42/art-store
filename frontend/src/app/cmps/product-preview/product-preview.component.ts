import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { Product } from '../../models/product'
import { User } from '../../models/user'

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})

export class ProductPreviewComponent {
  @Input() product!: Product
  @Input() user$!: Observable<User>
  @Input() isShopPage!: boolean
  @Output() remove = new EventEmitter()
  @Output() add = new EventEmitter()

  private router = inject(Router)

  onRemoveProduct(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.remove.emit(this.product._id)
  }

  onEditProduct(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.router.navigateByUrl(`/edit/${encodeURIComponent(this.product.name)}`)
  }

  onAddCart(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.add.emit(this.product)
  }
}