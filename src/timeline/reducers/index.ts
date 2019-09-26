import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'
import * as T from '../types.d'

const startingState: T.TBranchState = [ // Stub data for now
  {id: uuid(), content: 'Stubbed my toe', start: '2013-04-20'},
  {id: uuid(), content: 'First experienced allergy to the word "forever"', start: '2013-04-14'},
  {id: uuid(), content: 'First time experiencing enui', start: '2013-04-18'},
  {id: uuid(), content: 'Developed jogging habbit', start: '2013-04-16', end: '2013-04-19'},
  {id: uuid(), content: 'Jogged into bees nest', start: '2013-04-25'},
]

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case 'RANDOM_TIMELINE_DATUM_GENERATED':
      newState.push(action.datum)
      break
    case 'STUB': // for some reason the exhaustiveness check requires >= 2
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
