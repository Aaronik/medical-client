import { cloneDeep } from 'lodash'
import * as T from 'concerns/User.d'
import { ActionKeys } from 'common/actionKeys'

const startingState: T.TBranchState = {
  invitationLoading: false,
  activePatientId: false,
  users: {
    'f15c625d-9173-4ca7-a2f1-b1a1c34989d9': {
      id: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9',
      name: 'Bob Marley',
      userName: '',
      type: 'PATIENT',
      imageUrl: 'https://i.ytimg.com/vi/vdB-8eLEW8g/hqdefault.jpg',
      birthday: 'Tue Feb 06 1945 00:00:00 GMT-0700 (Pacific Standard Time)',
      adherence: 45,
      lastVisit: 'Tue Feb 06 1945 00:00:00 GMT-0700 (Pacific Standard Time)',
      joinDate: 'Tue Feb 06 1945 00:00:00 GMT-0700 (Pacific Standard Time)',
    },
    'c545dde9-56e0-4260-a13d-cc25de10311b': {
      id: 'c545dde9-56e0-4260-a13d-cc25de10311b',
      name: 'Etta James',
      userName: '',
      type: 'PATIENT'
    }
  }
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.USER_FETCHED:
      newState.users[action.payload.id] = action.payload
      break
    case ActionKeys.PATIENT_ADDED:
      newState.users[action.payload.id] = action.payload
      break
    case ActionKeys.INVITATION_LOADING:
      newState.invitationLoading = true
      break
    case ActionKeys.INVITATION_FINISHED:
      newState.invitationLoading = false
      break
    case ActionKeys.SET_ACTIVE_USER:
      newState.activePatientId = action.payload
      break
    case ActionKeys.CHANGE_USER_TO_ADMIN: // (temporary for demo purposes)
      newState.users[action.payload].type = 'ADMIN'
      console.log('signed in user is now:', newState.users[action.payload])
      break
    case ActionKeys.CHANGE_USER_TO_DOCTOR: // (temporary for demo purposes)
      newState.users[action.payload].type = 'DOCTOR'
      console.log('signed in user is now:', newState.users[action.payload])
      break
    case ActionKeys.CHANGE_USER_TO_PATIENT: // (temporary for demo purposes)
      newState.users[action.payload].type = 'PATIENT'
      console.log('signed in user is now:', newState.users[action.payload])
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer