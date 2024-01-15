import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { Product } from '../../models/shop'
import { Router } from '@angular/router'
import { ModalService } from '../../services/modal.service'
import { CommunicationService } from '../../services/communication.service'

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})

export class ProductPreviewComponent {
  @Input() product!: Product
  @Output() remove = new EventEmitter()
  @Output() add = new EventEmitter()
  private router = inject(Router)

  onRemoveProduct(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.remove.emit(this.product._id)
  }

  onAddCart(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.add.emit(this.product)
  }


  onEditProduct(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.router.navigateByUrl(`/shop/edit/${encodeURIComponent(this.product.name)}`)
  }
}