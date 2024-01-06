import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { EMPTY, of } from 'rxjs'
import * as UserActions from './user.actions'
import { UserService } from '../services/user.service'
import { User } from '../models/user'

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private uService: UserService) { }

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
                    map((user: User) => UserActions.SET_LOGGEDIN_USER({ user })),
                    catchError((error) => {
                        console.error(`Error fetching loggedin user: `, error)
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
                    map((user: User) => UserActions.SET_LOGGEDIN_USER({ user })),
                    catchError((error) => {
                        console.error(`Error fetching signup user: `, error)
                        return EMPTY
                    })
                )
            )
        )
    )

    // logout$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(UserActions.LOGOUT),
    //         mergeMap((action) =>
    //             this.uService.logout().pipe(
    //                 map(() => UserActions.LOGOUT()),
    //                 catchError((error) => {
    //                     console.error(`Error logging out user: `, error)
    //                     return EMPTY
    //                 })
    //             )
    //         )
    //     )
    // )
    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.LOGOUT),
            mergeMap(() =>
                this.uService.logout().pipe(
                    catchError((error) => {
                        console.error(`Error logging out user: `, error)
                        return of({ type: '[User] Logout Failed' })
                    }),
                    map(() => ({ type: '[User] Logout No Operation' }))
                )
            )
        ),
        { dispatch: false }
    )
}
