import { Injectable, inject } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError, take, filter, switchMap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { User } from '../models/user'
import { LOAD_USER } from '../store/user/user.actions'
import { selectLoggedinUser, selectUser } from '../store/user/user.selectors'

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  private store = inject(Store<AppState>)
  private router = inject(Router)

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  user$: Observable<User> = this.store.select(selectUser)

  canActivate(): Observable<boolean | UrlTree> {
    return this.loggedinUser$.pipe(
      switchMap(loggedInUser => {
        if (loggedInUser?._id) {
          this.store.dispatch(LOAD_USER({ userId: loggedInUser._id }))
          return this.user$.pipe(
            filter(user => !!user._id && user.isVerified),
            take(1),
            map(user => user?.isAdmin ? true : this.router.createUrlTree(['/'])),
          )
        } else return of(this.router.createUrlTree(['/']))
      }),
      catchError(() => of(this.router.createUrlTree(['/'])))
    )
  }
}