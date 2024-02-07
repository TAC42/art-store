import { Injectable, inject } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { UserService } from '../services/user.service'
import { selectLoggedinUser, selectUser } from '../store/user.selectors'
import { ActionsSubject, Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { Observable, of } from 'rxjs'
import { switchMap, map, catchError, take, filter } from 'rxjs/operators'
import { LOAD_USER, SET_USER } from '../store/user.actions'
import { User } from '../models/user'
import { ofType } from '@ngrx/effects'

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private store = inject(Store<AppState>)
  private router = inject(Router)
  private uService = inject(UserService)
  private actions$ = inject(ActionsSubject)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    return this.store.select(selectLoggedinUser).pipe(
      switchMap(user => {
        if (user?._id) {
          this.store.dispatch(LOAD_USER({ userId: user._id }))
          // Wait for SET_USER action
          return this.actions$.pipe(
            ofType(SET_USER),
            take(1),
            switchMap(() => this.store.select(selectUser)), 
            filter(newUser => !!newUser && !!newUser._id), 
            take(1), 
            map((newUser: User) => {
              console.log('selectUSER: ', newUser)

              if (newUser && newUser.isAdmin) {
                return true
              } else {
                console.log('WARNING UNAUTHORIZED USER!')
                return this.router.createUrlTree(['/'])
              }
            })
          )
        } else {
          console.log('User._id is falsy. Navigating away.')
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
