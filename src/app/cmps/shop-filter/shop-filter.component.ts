import { Component, OnInit, inject } from '@angular/core'
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs'
import { ShopService } from '../../services/shop.service'
import { ShopFilter } from '../../models/shop'

@Component({
  selector: 'shop-filter',
  templateUrl: './shop-filter.component.html'
})
export class ShopFilterComponent implements OnInit {
  shopService = inject(ShopService)
  subscription!: Subscription

  filterBy!: ShopFilter
  filterSubject$ = new Subject()

  ngOnInit(): void {
    this.subscription = this.shopService.filterBy$
      .subscribe(filterBy => {
        this.filterBy = filterBy
      })

    this.filterSubject$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        console.log('set filter subscribe');
        this.shopService.setFilterBy(this.filterBy)
      })
  }


  onSetFilter(val: string) {
    this.filterSubject$.next(val)
    // this.shopService.setFilterBy(this.filterBy)
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe?.()
  }
}

