import { cloneDeep, random } from 'lodash'
import * as T from 'auth/types.d'

const startingState = {
  sessionToken: "",
  userUrn: "",
  apiUrl: "",
  csrfToken: "",
  milliAtToken: ""
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'LOADED_HOST_MAP': {
      const { hosts } = action.payload
      const randomHostIndex = random(0, hosts.length - 1)
      newState.apiUrl = hosts[randomHostIndex].fullUrl
      break
    }
    case 'AUTHENTICATED':
      newState.sessionToken = action.payload.sessionToken
      newState.userUrn = action.payload.userUrn
      newState.csrfToken = action.payload.csrfToken
      newState.milliAtToken = action.payload.milliAtToken
      break
    case 'LOGOUT':
      newState.sessionToken = startingState.sessionToken
      newState.userUrn = startingState.userUrn
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
