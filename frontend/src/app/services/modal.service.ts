import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  private modals: { [key: string]: any } = {}
  private modalSubjects: { [key: string]: Subject<boolean> } = {}

  openModal(id: string, param?: string) {
    this.modals[id] = { isOpen: true, param }
    if (!this.modalSubjects[id]) {
      this.modalSubjects[id] = new Subject<boolean>()
    }
    this.modalSubjects[id].next(true)
  }

  closeModal(id: string) {
    this.modals[id] = { isOpen: false }
    if (this.modalSubjects[id]) {
      this.modalSubjects[id].next(false)
    }
  }

  isModalOpen(id: string): boolean {
    return !!this.modals[id]?.isOpen
  }

  getModalParam(id: string): string | undefined {
    return this.modals[id]?.param
  }

  onModalStateChange(id: string): Subject<boolean> {
    if (!this.modalSubjects[id]) {
      this.modalSubjects[id] = new Subject<boolean>()
    }
    return this.modalSubjects[id]
  }
}