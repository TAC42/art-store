import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ShopFilter } from '../../models/shop'
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'shop-filter',
  templateUrl: './shop-filter.component.html'
})
export class ShopFilterComponent {
 @Input() filterBy!: ShopFilter;
 @Output() onSetFilter = new EventEmitter<string>();


 private filterSubject: Subject<string> = new Subject<string>();

 constructor() {
   this.filterSubject
     .pipe(
       debounceTime(500), 
       distinctUntilChanged()
     )
     .subscribe((value: string) => {
       console.log('Value: ',value)
       this.onSetFilter.emit(value)
     })
 }

 onFilterChange(value: string): void {
   this.filterSubject.next(value)
 }
}