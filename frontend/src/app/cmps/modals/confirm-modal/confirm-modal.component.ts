import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  private modService = inject(ModalService)
  private commService = inject(CommunicationService)

  public isModalOpen: boolean = false

  private modalSubscription: any

  ngOnInit(): void {
    this.modalSubscription = this.modService.onModalStateChange('confirm').subscribe(
      (isOpen: boolean) => this.isModalOpen = isOpen)
  }

  getProductToRemove(): string | undefined {
    return this.modService.getModalParam('confirm')
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
      this.commService.emitRemoveProduct(productId)
    }
    this.modService.closeModal('confirm')
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) this.modalSubscription.unsubscribe()
  }
}