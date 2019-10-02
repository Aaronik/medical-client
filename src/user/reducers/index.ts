import { cloneDeep } from 'lodash'
import * as T from 'user/types.d'

const startingState = {
  name: "",
  userName: ""
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'USER_FETCHED':
      newState.name = action.payload.name
      newState.userName = action.payload.userName
      break
    case 'LOGOUT':
      newState = cloneDeep(startingState)
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
