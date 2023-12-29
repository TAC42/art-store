import { Component, OnDestroy, OnInit, HostBinding, inject } from '@angular/core'
import { Observable, Subscription, of } from 'rxjs'
import { selectProducts } from '../../store/shop.selectors'
import { Product } from '../../models/shop'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})

export class ShopComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  constructor(private store: Store<AppState>) { }
  
  products$: Observable<Product[]> = this.store.select(selectProducts)

  
  ngOnInit(): void {
    this.store.dispatch({ type: '[Shop] Load Products' })
  }
  

  onRemoveProduct(productId: string): void {
    // const removeSubscription = this.shopDbService.remove(productId).subscribe({
    //   next: () => this.loadProducts(),
    //   error: err => console.error('Error removing product:', err)
    // })
    // this.subscription.add(removeSubscription)
  }

}