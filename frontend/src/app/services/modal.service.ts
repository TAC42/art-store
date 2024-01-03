import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  private modals: { [key: string]: boolean } = {}

  constructor() { }

  openModal(id: string) {
    this.modals[id] = true
  }

  closeModal(id: string) {
    this.modals[id] = false
  }

  isModalOpen(id: string): boolean {
    return !!this.modals[id]
  }
}