import { cloneDeep } from 'lodash'
import * as T from '../types.d'

const startingState = {
  token: "",
  apiUrl: "",
  sampleResponse: {}
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'LOGIN_1':
      newState.sampleResponse = action.payload
      break
    case 'LOGIN_2':
      newState.sampleResponse = action.payload
      break
    case 'LOGIN_3':
      newState.sampleResponse = action.payload
      break
    case 'LOGOUT':
      newState.sampleResponse = action.payload
      break;
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
