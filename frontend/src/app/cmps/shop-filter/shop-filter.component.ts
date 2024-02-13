import { Component, EventEmitter, HostBinding, Input, OnInit, Output, inject } from '@angular/core'
import { ShopFilter } from '../../models/shop'
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'
import { User } from '../../models/user'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'shop-filter',
  templateUrl: './shop-filter.component.html'
})

export class ShopFilterComponent implements OnInit {
  @HostBinding('class.layout-row') layoutRowClass = true

  @Input() set filterBy(value: ShopFilter) {
    this._filterBy = { ...value }
  }
  @Input() loggedinUser!: User | null
  
  @Output() onSetFilter = new EventEmitter<string>()
  @Output() onOpenCart = new EventEmitter<void>()
  hasValue = false

  get filterBy(): ShopFilter {
    return this._filterBy
  }
  private _filterBy!: ShopFilter

  private filterSubject: Subject<string> = new Subject<string>()
  private modService = inject(ModalService)

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
    if (this.loggedinUser?._id) this.onOpenCart.emit()
    else this.modService.openModal('login')
  }
}