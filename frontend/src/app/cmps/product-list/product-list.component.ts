import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, HostBinding } from '@angular/core'
import { Product } from '../../models/shop'

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit, OnChanges {
  @HostBinding('class.layout-row') layoutRowClass = true

  @Input() isShopPage!: boolean
  @Input() products!: Product[] | null
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