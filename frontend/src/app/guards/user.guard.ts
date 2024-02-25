import { Injectable, inject } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { UserService } from '../services/user.service'
import { selectLoggedinUser } from '../store/user.selectors'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { Observable, of } from 'rxjs'
import { switchMap, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private uService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectLoggedinUser).pipe(
      switchMap(user => {
        if (user?._id) {
          console.log('selectUSER: ', user)
          return of(true)
        } else {
          console.log('WARNING NO USER!')
          return of(this.router.createUrlTree(['/']))
        }
      }),
      catchError(error => {
        console.error('Error checking user:', error)
        return of(this.router.createUrlTree(['/']))
      })
    )
  }
}
