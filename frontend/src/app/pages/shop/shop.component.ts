import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core'
import { Observable, Subscription, of } from 'rxjs'
import { Product } from '../../models/shop'
import { ShopDbService } from '../../services/shop-db.service'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})

export class ShopComponent implements OnInit, OnDestroy {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  products$: Observable<Product[]> = of([])
  private subscription: Subscription = new Subscription()

  constructor(private shopDbService: ShopDbService) { }

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.products$ = this.shopDbService.query()
  }

  onRemoveProduct(productId: string): void {
    const removeSubscription = this.shopDbService.remove(productId).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error('Error removing product:', err)
    })
    this.subscription.add(removeSubscription)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}