import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private removeProductSubject = new Subject<string>()
  removeProduct$ = this.removeProductSubject.asObservable()

  emitRemoveProduct(productId: string) {
    this.removeProductSubject.next(productId)
  }
}