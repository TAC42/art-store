import { Component, OnInit } from '@angular/core'
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs'
import { ShopDbService } from '../../services/shop-db.service'
import { ShopFilter } from '../../models/shop'

@Component({
  selector: 'shop-filter',
  templateUrl: './shop-filter.component.html'
})
export class ShopFilterComponent implements OnInit {
  private subscription!: Subscription

  filterBy: ShopFilter = this.shopDbService.getDefaultFilter()
  filterSubject$ = new Subject<string>()

  constructor(private shopDbService: ShopDbService) { }

  ngOnInit(): void {
    this.filterSubject$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(filterValue => {
        const newFilter = { ...this.filterBy, search: filterValue }
        this.shopDbService.setFilter(newFilter)
      })
  }

  onSetFilter(val: string): void {
    this.filterSubject$.next(val)
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}