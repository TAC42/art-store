import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, tap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'
import * as UserActions from './user.actions'
import { UserService } from '../services/user.service'
import { User } from '../models/user'
import { showSuccessMsg, showErrorMsg, EventBusService } from '../services/event-bus.service'

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions,
        private uService: UserService,
        private eBusService: EventBusService) { }

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.LOAD_USERS),
            mergeMap(() =>
                this.uService.query().pipe(
                    map((users: User[]) => UserActions.SET_USERS({ users })),
                    catchError((error) => {
                        console.error('Error loading users:', error)
                        return EMPTY
                    })
                )
            )
        )
    )

    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.LOAD_USER),
            mergeMap((action) =>
                this.uService.getById(action.userId).pipe(
                    map((user: User) => UserActions.SET_USER({ user })),
                    catchError((error) => {
                        console.error(`Error loading user ${action.userId}:`, error)
                        return EMPTY
                    })
                )
            )
        )
    )

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.LOGIN),
            mergeMap((action) =>
                this.uService.login(action.credentials).pipe(
                    tap((user: User) => showSuccessMsg('Login Successful', `Welcome back ${user.username}!`, this.eBusService)),
                    map((user: User) => UserActions.SET_LOGGEDIN_USER({ user })),
                    catchError((error) => {
                        console.error(`Error fetching logged-in user: `, error)
                        showErrorMsg('Signup Failed', 'Incorrect password / username', this.eBusService)
                        return EMPTY
                    })
                )
            )
        )
    )

    signup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.SIGNUP),
            mergeMap((action) =>
                this.uService.signup(action.credentials).pipe(
                    tap((user: User) => showSuccessMsg('Signup Successful', `Welcome ${user.username}!`, this.eBusService)),
                    map((user: User) => UserActions.SET_LOGGEDIN_USER({ user })),
                    catchError((error) => {
                        console.error(`Error fetching signup user: `, error)
                        showErrorMsg('Signup Failed', 'Please try again later', this.eBusService)
                        return EMPTY
                    })
                )
            )
        )
    )

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.LOGOUT),
            mergeMap(() =>
                this.uService.logout().pipe(
                    map(() => ({ type: '[User] Logout No Operation' })),
                    catchError((error) => {
                        console.error(`Error logging out user: `, error)
                        showErrorMsg('Logout Failed', 'This is awkward', this.eBusService)
                        return EMPTY
                    })
                )
            )
        ),
        { dispatch: false }
    )
}
