import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'
import { ProductFilter } from '../../models/product'

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html'
})

export class ProductFilterComponent {
  @Input() set filterBy(value: ProductFilter) {
    this._filterBy = { ...value }
  }
  @Output() onSetFilter = new EventEmitter<ProductFilter>()

  public hasValue = false

  private _filterBy!: ProductFilter

  private filterSubject: Subject<string> = new Subject<string>()

  get filterBy(): ProductFilter {
    return this._filterBy
  }

  constructor() {
    this.filterSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        const updatedFilter = { ...this._filterBy, search: value }
        this.onSetFilter.emit(updatedFilter)
        this.hasValue = true
      })
  }

  onFilterChange(value: string): void {
    this.filterSubject.next(value)
  }

  onClearFilter(event: Event) {
    event.stopPropagation()
    const updatedFilter = { ...this._filterBy, search: '' }
    this._filterBy = updatedFilter
    this.onSetFilter.emit(updatedFilter)
    this.hasValue = false
  }
}