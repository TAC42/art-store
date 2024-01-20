import { Component, OnInit, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit {
  private mService = inject(ModalService)
  private communicationService = inject(CommunicationService)

  modalSubscription: any
  isModalOpen: boolean = false

  ngOnInit(): void {
    this.modalSubscription = this.mService.onModalStateChange('confirm').subscribe((isOpen: boolean) => {
      this.isModalOpen = isOpen
    })
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe()
    }
  }

  getProductToRemove(): string | undefined {
    return this.mService.getProductId('confirm')
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen
  }

  closeModal() {
    this.isModalOpen = false
  }

  onAnswer(event: Event, answer: boolean) {
    const productId = this.getProductToRemove()

    if (answer && productId) {
      this.communicationService.emitRemoveProduct(productId)
    }

    this.mService.closeModal('confirm')
  }
}