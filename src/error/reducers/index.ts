import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'
import * as T from 'error/types.d'

const startingState: T.TBranchState = []

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
