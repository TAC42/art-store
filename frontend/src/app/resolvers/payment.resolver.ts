import { Injectable, inject } from '@angular/core'
import { Resolve, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { take, catchError, switchMap, filter } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { User } from '../models/user'
import { LOAD_USER } from '../store/user.actions'
import { selectLoggedinUser, selectUser } from '../store/user.selectors'

@Injectable({
  providedIn: 'root'
})

export class PaymentResolver implements Resolve<User | null> {
  private store = inject(Store<AppState>)
  private router = inject(Router)

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  user$: Observable<User> = this.store.select(selectUser)

  resolve(): Observable<User | null> {
    return this.loggedinUser$.pipe(
      switchMap(loggedInUser => {
        if (loggedInUser._id) {
          this.store.dispatch(LOAD_USER({ userId: loggedInUser._id }))
          return this.user$.pipe(
            filter(user => !!user._id && user.isVerified && user?.cart.length > 0),
            take(1),
            catchError(() => {
              this.router.navigate(['/shop'])
              return of(null)
            })
          )
        } else {
          this.router.navigate(['/shop'])
          return of(null)
        }
      }),
      catchError(() => {
        this.router.navigate(['/shop'])
        return of(null)
      })
    )
  }
}