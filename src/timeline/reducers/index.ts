import { cloneDeep } from 'lodash'
import * as T from 'timeline/types.d'

const startingState: T.TBranchState = {}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  const payload = action.payload

  switch (action.type) {
    case 'TIMELINE_DATUM_GENERATED':
      newState[payload.patientId] =
        newState[payload.patientId] ?
        newState[payload.patientId].concat([action.payload.datum]) :
        [action.payload.datum]
      break
    case 'TIMELINE_DATA_GENERATED':
      newState[payload.patientId] =
        newState[payload.patientId] ?
        newState[payload.patientId].concat(action.payload.data) :
        action.payload.data
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
