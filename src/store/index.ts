import { createStore, combineReducers } from 'redux'

import authReducer from 'auth/reducers'
import * as authTypes from 'auth/types.d'

import errorReducer from 'error/reducers'
import * as errorTypes from 'error/types.d'

import timelineReducer from 'timeline/reducers'
import * as timelineTypes from 'timeline/types.d'

export type TStoreState = {
  errors: errorTypes.TBranchState
  timeline: timelineTypes.TBranchState
  auth: authTypes.TBranchState
}

export type TAction = authTypes.TAction | errorTypes.TAction | timelineTypes.TAction

// Action type naming conventions:
// Consider the following flow:
// * Something happens in a view. This is phrased in past tense, like "A user clicked the button."
// * That view calls an appropriate action, which is not coupled to the view knowledge, e.g. "updateTheThing".
//   Note that "updateTheThing" has nothing to do with the button.
// * That action performs some calculations or async fetches or whatever, and then emits a dispatch event.
//   The event type has to do with what the action did. If the action generated a thing, the type would be
//   THING_GENERATED. The action has no knowledge of the store and what the store will do with the data,
//   so it would never be something imperative like SAVE_NEW_THING. The action doesn't know the store
//   needs to "save" something.

const reducer = combineReducers<TStoreState>({
  auth: authReducer,
  errors: errorReducer,
  timeline: timelineReducer
})

const store = createStore<TStoreState, TAction, unknown, unknown>(reducer)
export default store

// Type dispatch more tightly than it comes out of the box
export const dispatch = (action: TAction) => store.dispatch(action)
export type TStore = typeof store

