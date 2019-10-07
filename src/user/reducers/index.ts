import { cloneDeep } from 'lodash'
import * as T from 'user/types.d'

const startingState: T.TBranchState = {
  users: {},
  patients: {
    'f15c625d-9173-4ca7-a2f1-b1a1c34989d9': { userUrn: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', name: 'Bob Marley', userName: '' },
    'c545dde9-56e0-4260-a13d-cc25de10311b': { userUrn: 'c545dde9-56e0-4260-a13d-cc25de10311b', name: 'Etta James', userName: '' }
  }
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'USER_FETCHED':
      newState.users[action.payload.userUrn] = action.payload
      break
    case 'PATIENT_ADDED':
      newState.patients[action.payload.userUrn] = action.payload
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
