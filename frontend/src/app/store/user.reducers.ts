import { createReducer, on } from '@ngrx/store'
import * as UserActions from './user.actions'
import { User } from '../models/user'
import { UserService } from '../services/user.service'

export interface UserState {
    user: User
    loggedinUser: User
    users: User[]
    isLoading: boolean
}

const defaultUser: User = UserService.getDefaultUser()
const loggedinUser: User = UserService.getLoggedinUser()

const initialState: UserState = {
    user: defaultUser,
    loggedinUser: loggedinUser,
    users: [],
    isLoading: false,
}

export const userReducer = createReducer(
    initialState,
    on(UserActions.SET_USERS, (state, { users }) => ({ ...state, users })),

    on(UserActions.SET_USER, (state, { user }) => ({ ...state, user })),

    on(UserActions.UPDATE_USER, (state, { updatedUser }) => ({
        ...state,
        users: state.users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
        ),
    })),

    on(UserActions.SET_LOGGEDIN_USER, (state, { user }) => ({ ...state, loggedinUser: user })),

    on(UserActions.REMOVE_USER, (state, { userId }) => ({
        ...state,
        users: state.users.filter((user) => user._id !== userId),
    })),

    on(UserActions.SET_LOADING_STATE, (state, { isLoading }) => ({ ...state, isLoading })),

    on(UserActions.LOGOUT, (state) => ({
        ...state, loggedinUser: defaultUser,
    })),
)
