import { Component, OnInit, inject } from '@angular/core'
import { Observable} from 'rxjs'
import { selectProducts } from '../../store/shop.selectors'
import { Product } from '../../models/shop'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { Router } from '@angular/router'

@Component({
  selector: 'shop-index',
  templateUrl: './shop-index.component.html'
})
export class ShopIndexComponent implements OnInit {
  constructor(private store: Store<AppState>) { }
  router = inject(Router)

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

