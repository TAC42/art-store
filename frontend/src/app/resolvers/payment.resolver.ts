import { Injectable, inject } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { take, map } from 'rxjs/operators'
import { User } from '../models/user'
import { selectLoggedinUser } from '../store/user.selectors'
import { AppState } from '../store/app.state'
import { Store, select } from '@ngrx/store'

@Injectable({
  providedIn: 'root'
})
export class PaymentResolver implements Resolve<User | null> {
  private store = inject(Store<AppState>)
  private router = inject(Router)

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    return this.store.pipe(
      select(selectLoggedinUser),
      take(1), 
      map(loggedinUser => {
        const isLoggedIn = loggedinUser._id 
        const hasItemsInCart = loggedinUser.cart

        if (isLoggedIn && hasItemsInCart.length) {
          return loggedinUser 
        } else {
          this.router.navigate(['/shop'])
          return null
        }
      })
    )
  }
}
