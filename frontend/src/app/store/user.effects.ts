import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { EMPTY, of } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from './app.state'
import {
    CHECK_SESSION,
    LOAD_USER, LOAD_USERS, LOGIN, LOGOUT, SET_LOADING_STATE,
    SET_LOGGEDIN_USER, SET_USER, SET_USERS, SIGNUP, UPDATE_USER
} from './user.actions'
import { User } from '../models/user'
import { UserService } from '../services/user.service'
import { showSuccessMsg, showErrorMsg, EventBusService } from '../services/event-bus.service'

@Injectable()

export class UserEffects {
    private actions$ = inject(Actions)
    private userService = inject(UserService)
    private eBusService = inject(EventBusService)
    private store = inject(Store<AppState>)

    // handling of of all users in index
    loadUsers$ = createEffect(() =>
        this.actions$.pipe(ofType(LOAD_USERS),
            tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

            mergeMap(() => this.userService.query().pipe(
                map((users: User[]) => SET_USERS({ users })),
                catchError((error) => {
                    console.error('Error loading users:', error)
                    return of(SET_LOADING_STATE({ isLoading: false }))
                })
            )),
            tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))),
        )
    )

    // handling of user in details
    loadUser$ = createEffect(() =>
        this.actions$.pipe(ofType(LOAD_USER),
            tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

            mergeMap(action => this.userService.getById(action.userId).pipe(
                map((user: User) => SET_USER({ user })),
                catchError((error) => {
                    console.error(`Error loading user ${action.userId}:`, error)
                    return of(SET_LOADING_STATE({ isLoading: false }))
                })
            )),
            tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
        )
    )

    // handling of user session
    checkSession$ = createEffect(() =>
        this.actions$.pipe(ofType(CHECK_SESSION),
            switchMap(() => of(UserService.getLoggedinUser()).pipe(
                map(loggedinUser => {
                    if (loggedinUser) return SET_LOGGEDIN_USER({ user: loggedinUser })
                    else return LOGOUT()
                }),
                catchError(error => {
                    console.error('Error checking session:', error)
                    return EMPTY
                })
            ))
        )
    )

    // login scenario
    login$ = createEffect(() =>
        this.actions$.pipe(ofType(LOGIN),
            mergeMap(action => this.userService.login(action.credentials).pipe(
                tap(user => showSuccessMsg('Login Successful!',
                    `Welcome back ${user.username}!`, this.eBusService)),
                map(user => SET_LOGGEDIN_USER({ user })),
                catchError((error) => {
                    console.error(`Error fetching logged-in user: `, error)
                    showErrorMsg('Login Failed!',
                        'Incorrect password / username', this.eBusService)
                    return EMPTY
                })
            ))
        )
    )

    // signup scenario
    signup$ = createEffect(() =>
        this.actions$.pipe(ofType(SIGNUP),
            mergeMap(action => this.userService.signup(action.credentials).pipe(
                tap(user => showSuccessMsg('Signup Successful!',
                    `Welcome ${user.username}!`, this.eBusService)),
                map(user => SET_LOGGEDIN_USER({ user })),
                catchError((error) => {
                    console.error(`Error fetching signup user: `, error)
                    showErrorMsg('Signup Failed!',
                        'Please try again later.', this.eBusService)
                    return EMPTY
                })
            ))
        )
    )

    // logout scenario
    logout$ = createEffect(() =>
        this.actions$.pipe(ofType(LOGOUT),
            mergeMap(() => this.userService.logout().pipe(
                map(() => ({ type: '[User] Logout No Operation' })),
                catchError((error) => {
                    console.error(`Error logging out user: `, error)
                    showErrorMsg('Logout Failed!',
                        'This is awkward...', this.eBusService)
                    return EMPTY
                })
            ))
        ),
        { dispatch: false }
    )

    // handling of user updating
    updateUser$ = createEffect(() =>
        this.actions$.pipe(ofType(UPDATE_USER),
            tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))),

            mergeMap(action => this.userService.save(action.updatedUser).pipe(
                tap((user: User) => {
                    this.userService.setLoggedinUser(user)
                    showSuccessMsg('User Changes Saved!',
                        `Enjoy the new you ${user.username}!`, this.eBusService)
                }),
                map(user => SET_LOGGEDIN_USER({ user })),
                catchError(error => {
                    console.error('Error loading User:', error)
                    showErrorMsg('Failed To Edit!',
                        'Sorry, please try again later.', this.eBusService)
                    return of(SET_LOADING_STATE({ isLoading: false }))
                })
            )),
            tap(() => this.store.dispatch(SET_LOADING_STATE({ isLoading: false })))
        )
    )
}