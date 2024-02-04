import { createAction, props } from '@ngrx/store'
import { User, UserCredentials, UserSignup } from '../models/user'

// handling of user loading
export const SET_LOADING_STATE = createAction(
    '[Shop] Set Loading State',
    props<{ isLoading: boolean }>()
)

// handling of user session
export const CHECK_SESSION = createAction('[User] Check Session')
export const LOAD_LOGGEDIN_USER = createAction('[User] Load Loggedin User')
export const SET_LOGGEDIN_USER = createAction(
    '[User] Set Loggedin User',
    props<{ user: User }>()
)
export const LOGIN = createAction(
    '[User] Login',
    props<{ credentials: UserCredentials }>()
)
export const SIGNUP = createAction(
    '[User] Signup',
    props<{ credentials: UserSignup }>()
)
export const LOGOUT = createAction('[User] Logout')

// handling of of all users in index
export const LOAD_USERS = createAction('[User] Load Users')
export const SET_USERS = createAction(
    '[User] Set Users',
    props<{ users: User[] }>()
)

// handling of user in details
export const LOAD_USER = createAction(
    '[User] Load User',
    props<{ userId: string }>()
)
export const SET_USER = createAction(
    '[User] Set User',
    props<{ user: User }>()
)

// handling of user updating
export const UPDATE_USER = createAction(
    '[User] Update User',
    props<{ updatedUser: User }>()
)

// handling of user deletion
export const REMOVE_USER = createAction(
    '[User] Remove User',
    props<{ userId: string }>()
)