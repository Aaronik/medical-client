import { createStore, combineReducers } from 'redux'

import authReducer from 'concerns/Auth.reducer'
import * as authTypes from 'concerns/Auth.d'

import alertReducer from 'applets/Alert.reducer'
import * as alertTypes from 'applets/Alert.d'

import timelineReducer from 'applets/Timeline.reducer'
import * as timelineTypes from 'applets/Timeline.d'

import userReducer from 'concerns/User.reducer'
import * as userTypes from 'concerns/User.d'

import appGutterNavReducer from 'applets/AppGutterNav.reducer'
import * as gutterNavTypes from 'applets/AppGutterNav.d'

import notificationReducer from 'concerns/Notification.reducer'
import * as notificationTypes from 'concerns/Notification.d'

export type TStoreState = {
  alerts: alertTypes.TBranchState
  timeline: timelineTypes.TBranchState
  auth: authTypes.TBranchState
  user: userTypes.TBranchState
  appGutterNav: gutterNavTypes.TBranchState
  notifications: notificationTypes.TBranchState
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
  notifications: notificationReducer,
})

const store = createStore<TStoreState, TAction, unknown, unknown>(reducer)
export default store

// TODO temporary, just a nice to have for development
// @ts-ignore
window.store = store

// Type dispatch more tightly than it comes out of the box
export const dispatch = (action: TAction) => store.dispatch(action)
export type TStore = typeof store
