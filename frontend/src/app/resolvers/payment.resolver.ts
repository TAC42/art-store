import { Injectable, inject } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { take, tap, filter } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { User } from '../models/user'
import { selectUser } from '../store/user.selectors'

@Injectable({
  providedIn: 'root'
})

export class PaymentResolver implements Resolve<User | null> {
  private store = inject(Store<AppState>)
  private router = inject(Router)

  user$: Observable<User> = this.store.select(selectUser)

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<User | null> {
    return this.user$.pipe(
      take(1),
      tap(user => {
        if (!(user._id && user.cart.length))
          this.router.navigate(['/shop'])
      }),
      filter(user => !!user._id && user.cart.length > 0)
    )
  }
}