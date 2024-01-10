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
  private router = inject(Router)
  private mService = inject(ModalService)
  private communicationService = inject(CommunicationService)
  private removeAnswer: boolean = false

  ngOnInit() {
    this.communicationService.removeProduct$.subscribe((productId: string) => {
      this.onRemoveProduct(productId)
    })
  }

  onRemoveProduct(productId: string) {
    console.log('IN REMOVE PRODUCT PRODUCT PREVIEW',productId)
    this.remove.emit(productId)
  }

  onToggleConfirmModal(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.mService.openModal(`confirm`,this.product._id)
  }

  // toggleRemoveAnswer() {
  //   this.removeAnswer = !this.removeAnswer
  // }
  onEditProduct(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.router.navigateByUrl(`/shop/edit/${encodeURIComponent(this.product.name)}`)
  }
}