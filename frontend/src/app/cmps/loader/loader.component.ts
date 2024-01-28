import { Component, OnInit, inject } from '@angular/core'
import { EMPTY, Observable } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { selectIsLoading } from '../../store/shop.selectors'

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html'
})

export class LoaderComponent implements OnInit {
  private store = inject(Store<AppState>)

  isLoading$: Observable<boolean> = EMPTY

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
  }
}
