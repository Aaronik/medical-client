import { createStore } from 'redux'
import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'

export type TTimelineDatum = {
  id: string
  content: string
  start: string
  end?: string
}

export type TStoreState = {
  timelineData: TTimelineDatum[]
}

const startingState: TStoreState = {
  timelineData: [ // Stub data for now
    {id: uuid(), content: 'Stubbed my toe', start: '2013-04-20'},
    {id: uuid(), content: 'First experienced allergy to the word "forever"', start: '2013-04-14'},
    {id: uuid(), content: 'First time experiencing enui', start: '2013-04-18'},
    {id: uuid(), content: 'Developed jogging habbit', start: '2013-04-16', end: '2013-04-19'},
    {id: uuid(), content: 'Jogged into bees nest', start: '2013-04-25'},
  ]
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
  { type: 'RANDOM_TIMELINE_DATUM_GENERATED', datum: TTimelineDatum } |
  { type: 'PLACEHOLDER' } // only here until there are 2 or more of these actions (required by exhaustiveness check)

const reducer = (state: TStoreState = startingState, action: TAction): TStoreState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'RANDOM_TIMELINE_DATUM_GENERATED':
      newState.timelineData.push(action.datum)
      break
    case 'PLACEHOLDER': // TODO delete once there are >= 2 store actions
      break
    default:
      // Exhastiveness check (make sure all types are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

const store = createStore(reducer)
export default store
export type TStore = typeof store

