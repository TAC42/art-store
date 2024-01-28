import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { Product } from '../../models/shop'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { User } from '../../models/user'
import { selectLoggedinUser } from '../../store/user.selectors'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'

@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html'
})

export class ProductPreviewComponent {
  @Input() product!: Product
  @Output() remove = new EventEmitter()
  @Output() add = new EventEmitter()
  private router = inject(Router)
  private store = inject(Store<AppState>)

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)

  onRemoveProduct(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.remove.emit(this.product._id)
  }

  onAddCart(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.add.emit(this.product)
  }

  onEditProduct(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.router.navigateByUrl(`/shop/edit/${encodeURIComponent(this.product.name)}`)
  }
}