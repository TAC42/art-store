import { Component, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'

@Component({
  selector: 'user-auth-modal',
  templateUrl: './user-auth-modal.component.html'
})

export class UserAuthModalComponent {
  public modService = inject(ModalService)


  closeModal() {
    this.modService.closeModal('user-auth')
  }
}
