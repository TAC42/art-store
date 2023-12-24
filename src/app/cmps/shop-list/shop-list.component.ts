import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/shop';

@Component({
  selector: 'shop-list',
  templateUrl: './shop-list.component.html'
})
export class ShopListComponent implements OnInit {
  @Input() products!: Product[] | null
  @Output() remove = new EventEmitter()

  ngOnInit(): void {
    console.log('this.products:', this.products)
  }

}