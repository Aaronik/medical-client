import { createStore } from 'redux'
import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'

export type TStoreState = {
  errors: TError[]
  timelineData: TTimelineDatum[]
  auth: TAuthData
}

export type TError = string

export type TTimelineDatum = {
  id: string
  content: string
  start: string
  end?: string
}

type TDiscoveryHost = {
  hostUrl: string
  port: number
  token: string
  secure: boolean
  fullUrl: string
}

export type TDiscoveryResponse = {
  hosts: TDiscoveryHost[]
  serviceToken: string
  serviceMap: object // Docs are unclear on this
  unannounced: boolean
}

export type TAuthenticationResponse = {
  expiresAt: number
  sessionToken64: string
  userNameHash64: string
  reasonCode: 'NONE'
  validity: 'VALID'
}

export type TLogoutResponse = {
  message: string
}

type TAuthData = {
  token: string
  apiUrl: string
  sampleResponse: any
}

const startingState: TStoreState = {
  errors: [],
  timelineData: [ // Stub data for now
    {id: uuid(), content: 'Stubbed my toe', start: '2013-04-20'},
    {id: uuid(), content: 'First experienced allergy to the word "forever"', start: '2013-04-14'},
    {id: uuid(), content: 'First time experiencing enui', start: '2013-04-18'},
    {id: uuid(), content: 'Developed jogging habbit', start: '2013-04-16', end: '2013-04-19'},
    {id: uuid(), content: 'Jogged into bees nest', start: '2013-04-25'},
  ],
  auth: {
    token: "",
    apiUrl: "",
    sampleResponse: {}
  }
}

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

type TAction =
  { type: 'ERROR', payload: string } |
  { type: 'CLEAR_ERRORS' } |
  { type: 'RANDOM_TIMELINE_DATUM_GENERATED', datum: TTimelineDatum } |
  { type: 'LOGIN_1', payload: TDiscoveryResponse } |
  { type: 'LOGIN_2', payload: any } |
  { type: 'LOGIN_3', payload: TAuthenticationResponse } |
  { type: 'LOGOUT', payload: TLogoutResponse }

const reducer = (state: TStoreState = startingState, action: TAction): TStoreState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'ERROR':
      newState.errors.push(action.payload)
      break
    case 'CLEAR_ERRORS':
      newState.errors = []
      break
    case 'RANDOM_TIMELINE_DATUM_GENERATED':
      newState.timelineData.push(action.datum)
      break
    case 'LOGIN_1':
      newState.auth.sampleResponse = action.payload
      break
    case 'LOGIN_2':
      newState.auth.sampleResponse = action.payload
      break
    case 'LOGIN_3':
      newState.auth.sampleResponse = action.payload
      break
    case 'LOGOUT':
      newState.auth.sampleResponse = action.payload
      break;
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

const store = createStore(reducer)
export default store

// Type dispatch more tightly than it comes out of the box
export const dispatch = (action: TAction) => store.dispatch(action)
export type TStore = typeof store

