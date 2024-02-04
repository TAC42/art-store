import { Component, OnInit, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit {
  private modService = inject(ModalService)
  private communicationService = inject(CommunicationService)

  isModalOpen: boolean = false
  private modalSubscription: any

  ngOnInit(): void {
    this.modalSubscription = this.modService.onModalStateChange('confirm').subscribe(
      (isOpen: boolean) => this.isModalOpen = isOpen)
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }

  getProductToRemove(): string | undefined {
    return this.modService.getProductId('confirm')
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen
  }

  closeModal() {
    this.isModalOpen = false
  }

  onAnswer(event: Event, answer: boolean) {
    event.stopPropagation()
    const productId = this.getProductToRemove()

    if (answer && productId) {
      this.communicationService.emitRemoveProduct(productId)
    }
    this.modService.closeModal('confirm')
  }
}