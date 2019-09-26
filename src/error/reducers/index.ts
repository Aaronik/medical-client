import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'
import * as T from '../types.d'

const startingState: T.TBranchState = []

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

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'ERROR': {
      const error = {
        id: uuid(),
        message: action.payload
      }

      newState.push(error)
      break
    }
    case 'CLEAR_ERRORS':
      newState = []
      break
    case 'CLEAR_ERROR':
      newState = newState.filter(e => e.id !== action.payload)
      break;
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
