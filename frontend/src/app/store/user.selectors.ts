import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UserState } from './user.reducers'

export const selectUserState = createFeatureSelector<UserState>('user')


export const selectUsers = createSelector(selectUserState, (state) => state.users)
export const selectUser = createSelector(selectUserState, (state) => state.user)
export const selectLoggedinUser = createSelector(selectUserState, (state) => state.loggedinUser)
export const selectIsLoading = createSelector(selectUserState, (state) => state.isLoading)

