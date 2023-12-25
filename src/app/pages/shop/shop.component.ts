import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { Product } from '../../models/shop';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit, OnDestroy {
  shopService = inject(ShopService)
  subscription!: Subscription
  products$!: Observable<Product[]>
  prm = Promise.resolve(99)

  ngOnInit(): void {
    this.subscription = this.shopService.loadProducts()
      .pipe(take(1))
      .subscribe({
        error: err => console.log('err:', err)
      })

    this.products$ = this.shopService.products$
  }


  onRemoveProduct(shopId: string) {
    this.shopService.deleteProduct(shopId)
      .subscribe({
        error: err => console.log('err:', err)
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
