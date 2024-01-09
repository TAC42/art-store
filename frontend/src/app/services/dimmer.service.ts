import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DimmerService {
  dimmerActive: boolean = false;
  dimmerSubject: Subject<boolean> = new Subject<boolean>()

  setDimmerActive(active: boolean) {
    this.dimmerActive = active;
    this.dimmerSubject.next(active); // Emit the change
  }
}
