import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs'
import { ProductFilter } from '../../models/product'

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html'
})

export class ProductFilterComponent implements OnInit, OnDestroy {
  @Input() set filterBy(value: ProductFilter) {
    this._filterBy = { ...value }
  }
  @Output() onSetFilter = new EventEmitter<ProductFilter>()

  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  public hasValue = false

  private _filterBy!: ProductFilter
  private filterSubject: Subject<string> = new Subject<string>()
  private destroy$ = new Subject<void>()

  get filterBy(): ProductFilter { return this._filterBy }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const search = params['search'] || ''
        this._filterBy = { ...this._filterBy, search }
        this.hasValue = !!search
      })
    this.filterSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        const updatedFilter = { ...this._filterBy, search: value }
        this.onSetFilter.emit(updatedFilter)
        this.updateQueryParams(updatedFilter)
        this.hasValue = true
      })
  }

  onFilterChange(value: string): void {
    this.filterSubject.next(value)
  }

  onClearFilter(event: Event): void {
    event.stopPropagation()
    const updatedFilter = { ...this._filterBy, search: '' }
    this._filterBy = updatedFilter
    this.onSetFilter.emit(updatedFilter)
    this.updateQueryParams(updatedFilter)
    this.hasValue = false
  }

  updateQueryParams(newFilter: ProductFilter): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const updatedParams = { ...params, search: newFilter.search }
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: updatedParams,
          queryParamsHandling: 'merge',
        })
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}