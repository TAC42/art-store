import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class DimmerService {
  dimmerActive: boolean = false

  toggleDimmerClass() {
    this.dimmerActive = !this.dimmerActive
    // Additional logic to add/remove dimmer class from the main app component
    // e.g., using BehaviorSubject, EventEmitter, or a simple boolean flag
  }

  // Other methods or properties related to managing the dimmer class
}
