import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Observable } from 'rxjs'
import { Product } from '../../models/product'
import { User } from '../../models/user'

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html'
})

export class ProductListComponent {
  @Input() isShopPage!: boolean
  @Input() products!: Product[] | null
  @Input() user$!: Observable<User>
  @Input() isLoading!: boolean
  @Output() remove = new EventEmitter<string>()
  @Output() add = new EventEmitter<Product>()
}