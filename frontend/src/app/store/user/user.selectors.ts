import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UserState } from './user.reducers'

export const selectUserState = createFeatureSelector<UserState>('user')

// handling of user loading
export const selectIsLoading = createSelector(
    selectUserState,
    (state: UserState) => state.isLoading
)

// handling of user session
export const selectLoggedinUser = createSelector(
    selectUserState,
    (state: UserState) => state.loggedinUser
)

// handling of all users in index
export const selectUsers = createSelector(
    selectUserState,
    (state: UserState) => state.users
)

// handling of user in details
export const selectUser = createSelector(
    selectUserState,
    (state: UserState) => state.user
)