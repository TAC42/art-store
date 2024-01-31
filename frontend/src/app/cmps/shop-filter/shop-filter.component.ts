import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ShopFilter } from '../../models/shop'
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'
import { User } from '../../models/user'

@Component({
  selector: 'shop-filter',
  templateUrl: './shop-filter.component.html'
})

export class ShopFilterComponent implements OnInit {
  @Input() set filterBy(value: ShopFilter) {
    this._filterBy = { ...value }
  }
  @Input() loggedinUser!: User | null; 
  @Output() onSetFilter = new EventEmitter<string>()
  @Output() onOpenCart = new EventEmitter<void>()
  hasValue = false

get filterBy(): ShopFilter {
  return this._filterBy
}

private _filterBy!: ShopFilter


  private filterSubject: Subject<string> = new Subject<string>()

  constructor() {
    this.filterSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        console.log('Value: ', value)
        this.onSetFilter.emit(value)
        this.hasValue = true
      })
  }

  ngOnInit(): void {
    console.log('filterBy in shopfilter: ', this.filterBy)
  }

  onFilterChange(value: string): void {
    this.filterSubject.next(value)
  }

  onClearFilter(event: Event) {
    event.stopPropagation()
    this.filterBy.search = ''
    this.onSetFilter.emit('')
    this.hasValue = false
  }

  onCartOpen(event: Event) {
    event.stopPropagation()
    if(this.loggedinUser) this.onOpenCart.emit()
    else console.log('NO USER LOGGED IN!');
    
  }
}