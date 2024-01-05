import { createAction, props } from '@ngrx/store'
import { User, UserCredentials, UserSignup } from '../models/user'

export const LOAD_USERS = createAction('[User] Load Users')
export const LOAD_USER = createAction('[User] Load User', props<{ userId: string }>())
export const LOAD_LOGGEDIN_USER = createAction('[User] Load Loggedin User')

export const UPDATE_USER = createAction('[User] Update User', props<{ updatedUser: User }>())
export const REMOVE_USER = createAction('[User] Remove User', props<{ userId: string }>())
export const LOGIN = createAction('[User] Login', props<{ credentials: UserCredentials }>())
export const SIGNUP = createAction('[User] Signup', props<{ credentials: UserSignup }>())
export const LOGOUT = createAction('[User] Logout')

export const SET_USERS = createAction('[User] Set Users', props<{ users: User[] }>())
export const SET_USER = createAction('[User] Set User', props<{ user: User }>())
export const SET_LOGGEDIN_USER = createAction('[User] Set Loggedin User', props<{ user: User }>())
export const SET_LOADING_STATE = createAction('[Shop] Set Loading State', props<{ isLoading: boolean }>())



