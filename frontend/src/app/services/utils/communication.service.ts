import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private removeProductSubject = new Subject<string>()
  removeProduct$ = this.removeProductSubject.asObservable()

  private cartStateSubject = new Subject<void>()
  cartState$ = this.cartStateSubject.asObservable()

  emitRemoveProduct(productId: string) {
    this.removeProductSubject.next(productId)
  }

  emitCartState() {
    this.cartStateSubject.next()
  }
}