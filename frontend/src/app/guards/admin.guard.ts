import { Injectable, inject } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { map, catchError, take } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { User } from '../models/user'
import { selectUser } from '../store/user.selectors'

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  private store = inject(Store<AppState>)
  private router = inject(Router)

  user$: Observable<User> = this.store.select(selectUser)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> {
    return this.user$.pipe(
      take(1),
      map(user => {
        if (user && user.isAdmin) return true
        else {
          console.log('WARNING UNAUTHORIZED USER!')
          return this.router.createUrlTree(['/'])
        }
      }),
      catchError(error => {
        console.error('Error checking user:', error)
        return of(this.router.createUrlTree(['/']))
      })
    )
  }
}