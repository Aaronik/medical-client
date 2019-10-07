import { createStore, combineReducers } from 'redux'

import authReducer from 'auth/reducers'
import * as authTypes from 'auth/types.d'

import errorReducer from 'error/reducers'
import * as errorTypes from 'error/types.d'

import timelineReducer from 'timeline/reducers'
import * as timelineTypes from 'timeline/types.d'

import userReducer from 'user/reducers'
import * as userTypes from 'user/types.d'

export type TStoreState = {
  errors: errorTypes.TBranchState
  timeline: timelineTypes.TBranchState
  auth: authTypes.TBranchState
  user: userTypes.TBranchState
}

export type TAction =
  authTypes.TAction |
  errorTypes.TAction |
  timelineTypes.TAction |
  userTypes.TAction

const reducer = combineReducers<TStoreState>({
  auth: authReducer,
  errors: errorReducer,
  timeline: timelineReducer,
  user: userReducer,
})

const store = createStore<TStoreState, TAction, unknown, unknown>(reducer)
export default store

// TODO temporary, just a nice to have for development
// @ts-ignore
window.store = store

// Type dispatch more tightly than it comes out of the box
export const dispatch = (action: TAction) => store.dispatch(action)
export type TStore = typeof store

// helpers
export const isSignedIn = () => (
  !!store.getState().auth.sessionToken
)
