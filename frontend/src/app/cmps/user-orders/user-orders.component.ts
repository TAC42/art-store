import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Order } from '../../models/order'
import { Observable } from 'rxjs'

@Component({
  selector: 'user-orders',
  templateUrl: './user-orders.component.html'
})

export class UserOrdersComponent {
  @Input() orders$!: Observable<Order[]>
  @Input() optionState: string = ''
  @Output() optionStateChange = new EventEmitter<string>()

  setSelection(option: string): void {
    if (this.optionState === option) return
    this.optionState = option
    this.optionStateChange.emit(this.optionState)
  }

  getStatusClass(status: string): string {
    const statusColors = {
      pending: 'pending',
      accepted: 'accepted',
      delivering: 'delivering',
      shipped: 'shipped',
      cancelled: 'cancelled',
    }
    return statusColors[status.toLowerCase() as 'pending' |
      'cancelled' | 'accepted' | 'delivering' | 'shipped'] || 'gray'
  }
}