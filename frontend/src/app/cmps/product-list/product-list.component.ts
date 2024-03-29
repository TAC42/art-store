import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core'
import { Product } from '../../models/shop'
import { Observable } from 'rxjs'
import { User } from '../../models/user'

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit, OnChanges {
  @Input() isShopPage!: boolean
  @Input() products!: Product[] | null
  @Input() user$!: Observable<User>
  @Input() isLoading!: boolean
  @Output() remove = new EventEmitter<string>()
  @Output() add = new EventEmitter<Product>()

  ngOnInit(): void {
    console.log('OnInit - this.products:', this.products)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      console.log('OnChanges - this.products:', this.products)
    }
  }
}