import { createStore, combineReducers } from 'redux'

import authReducer from 'concerns/auth/Auth.reducer'
import * as authTypes from 'concerns/auth/Auth.d'

import alertReducer from 'applets/alert/Alert.reducer'
import * as alertTypes from 'applets/alert/Alert.d'

import timelineReducer from 'applets/timeline/Timeline.reducer'
import * as timelineTypes from 'applets/timeline/Timeline.d'

import userReducer from 'concerns/user/User.reducer'
import * as userTypes from 'concerns/user/User.d'

import appGutterNavReducer from 'applets/app-gutter-nav/AppGutterNav.reducer'
import * as gutterNavTypes from 'applets/app-gutter-nav/AppGutterNav.d'

export type TStoreState = {
  alerts: alertTypes.TBranchState
  timeline: timelineTypes.TBranchState
  auth: authTypes.TBranchState
  user: userTypes.TBranchState
  appGutterNav: gutterNavTypes.TBranchState
}

export type TAction =
  authTypes.TAction |
  alertTypes.TAction |
  timelineTypes.TAction |
  userTypes.TAction |
  gutterNavTypes.TAction

const reducer = combineReducers<TStoreState>({
  auth: authReducer,
  alerts: alertReducer,
  timeline: timelineReducer,
  user: userReducer,
  appGutterNav: appGutterNavReducer,
})

const store = createStore<TStoreState, TAction, unknown, unknown>(reducer)
export default store

// TODO temporary, just a nice to have for development
// @ts-ignore
window.store = store

// Type dispatch more tightly than it comes out of the box
export const dispatch = (action: TAction) => store.dispatch(action)
export type TStore = typeof store
