import { Component, inject } from '@angular/core'
import { ModalService } from '../../../services/utils/modal.service'

@Component({
  selector: 'image-display',
  templateUrl: './image-display.component.html'
})

export class ImageDisplayComponent {
  public modService = inject(ModalService)

  getImageUrl(): string {
    return this.modService.getModalParam('image-display') || ''
  }

  closeImageDisplayModal(): void {
    this.modService.closeModal('image-display')
  }
}
