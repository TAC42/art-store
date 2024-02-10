import { Component, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'

@Component({
  selector: 'image-display',
  templateUrl: './image-display.component.html'
})

export class ImageDisplayComponent {
  public modService = inject(ModalService)

  public imageUrl: string = ''

  getImageUrl(): string {
    return this.modService.getModalParam('image-display') || ''
  }

  closeImageDisplayModal(): void {
    this.modService.closeModal('image-display')
  }
}
