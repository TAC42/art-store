import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  private modals: { [key: string]: boolean } = {}

  constructor() { }

  openModal(id: string) {
    this.modals[id] = true
    console.log(`Modal ${id} opened`, this.modals)
  }

  closeModal(id: string) {
    this.modals[id] = false
    console.log(`Modal ${id} closed`, this.modals)
  }

  isModalOpen(id: string): boolean {
    return !!this.modals[id]
  }
}