import { Injectable, inject } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { User } from '../models/user'
import { selectLoggedinUser } from '../store/user/user.selectors'

@Injectable({
  providedIn: 'root'
})

export class SignupGuard implements CanActivate {
  private store = inject(Store<AppState>)
  private router = inject(Router)

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)

  canActivate(): Observable<boolean | UrlTree> {
    return this.loggedinUser$.pipe(
      map(loggedInUser => {
        return loggedInUser?._id ? this.router.createUrlTree(['/']) : true
      }),
      catchError(() => of(true))
    )
  }
}