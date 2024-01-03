import { Component } from '@angular/core'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html'
})

export class LoginModalComponent {

  constructor(public mS: ModalService) { }

  closeLoginModal() {
    this.mS.closeModal('login')
  }
}
