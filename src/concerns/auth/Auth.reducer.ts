import { cloneDeep, random } from 'lodash'
import { ActionKeys } from 'common/actionKeys'
import * as T from './Auth.d'

const startingState = {
  userUrn: "",
  apiUrl: "",
  milliAtToken: ""
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.LOADED_HOST_MAP: {
      const { hosts } = action.payload
      const randomHostIndex = random(0, hosts.length - 1)
      newState.apiUrl = hosts[randomHostIndex].fullUrl
      break
    }
    case ActionKeys.AUTHENTICATED:
      newState.milliAtToken = action.payload.milliAtToken
      newState.userUrn      = action.payload.userUrn
      break
    case ActionKeys.LOGOUT:
      newState.milliAtToken = startingState.milliAtToken
      newState.userUrn      = startingState.userUrn
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
