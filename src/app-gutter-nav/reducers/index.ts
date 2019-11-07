import { cloneDeep } from 'lodash'
import * as T from 'app-gutter-nav/types.d'
import { ActionKeys } from 'common/action-keys'

const startingState: T.TBranchState = {
  gutterNavActive: true
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.TOGGLE_GUTTER_NAV: {
      newState.gutterNavActive = !newState.gutterNavActive
      break
    }
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      // (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
