import { cloneDeep } from 'lodash'
import * as T from 'user/types.d'

const startingState: T.TBranchState = {
  'f15c625d-9173-4ca7-a2f1-b1a1c34989d9': {
    id: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9',
    name: 'Bob Marley',
    userName: '',
    type: 'PATIENT'
  },
  'c545dde9-56e0-4260-a13d-cc25de10311b': {
    id: 'c545dde9-56e0-4260-a13d-cc25de10311b',
    name: 'Etta James',
    userName: '',
    type: 'PATIENT'
  }
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'USER_FETCHED':
      newState[action.payload.id] = action.payload
      break
    case 'PATIENT_ADDED':
      newState[action.payload.id] = action.payload
      break
    case 'CHANGE_USER_TO_ADMIN': // (temporary for demo purposes)
      newState[action.payload].type = 'ADMIN'
      console.log('signed in user is now:', newState[action.payload])
      break
    case 'CHANGE_USER_TO_DOCTOR': // (temporary for demo purposes)
      newState[action.payload].type = 'DOCTOR'
      console.log('signed in user is now:', newState[action.payload])
      break
    case 'CHANGE_USER_TO_PATIENT': // (temporary for demo purposes)
      newState[action.payload].type = 'PATIENT'
      console.log('signed in user is now:', newState[action.payload])
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
