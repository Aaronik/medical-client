import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'
import * as T from './Alert.d'
import { ActionKeys } from 'common/actionKeys'

const startingState: T.TBranchState = []

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.ALERT: {
      const alert: T.TAlert = {
        id: uuid(),
        message: action.payload.message,
        type: action.payload.type
      }

      newState.push(alert)
      break
    }
    case ActionKeys.CLEAR_ALERTS:
      newState = []
      break
    case ActionKeys.CLEAR_ALERT:
      newState = newState.filter(a => a.id !== action.payload)
      break;
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
