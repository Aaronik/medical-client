import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'
import * as T from 'timeline/types.d'

const startingState: T.TBranchState = {
  'f15c625d-9173-4ca7-a2f1-b1a1c34989d9': [{
    id: uuid(),
    title: 'This is a title',
    type: 'point',
    editable: true,
    start: '2019-10-14',
    content: 'Joined Milli Health'
  }, {
    id: uuid(),
    title: 'This is a title',
    type: 'background',
    end: '2019-10-16',
    editable: true,
    start: '2019-10-15',
    content: 'Recovered from gout'
  }],
  'c545dde9-56e0-4260-a13d-cc25de10311b': [{
    id: uuid(),
    type: 'point',
    start: '2019-10-14',
    content: 'Joined Milli Health'
  }]
}

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
