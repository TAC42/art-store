import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, HostBinding } from '@angular/core'
import { Product } from '../../models/shop'

@Component({
  selector: 'shop-list',
  templateUrl: './shop-list.component.html'
})

export class ShopListComponent implements OnInit, OnChanges {
  @HostBinding('class.layout-row') layoutRowClass = true

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