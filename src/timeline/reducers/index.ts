import uuid from 'uuid/v4'
import { cloneDeep } from 'lodash'
import * as T from 'timeline/types.d'
import { ActionKeys } from 'common/action-keys'

const startingState: T.TBranchState = {
  'f15c625d-9173-4ca7-a2f1-b1a1c34989d9': {
    items: [{
      id: uuid(),
      group: 1,
      type: 'point',
      editable: true,
      start: '2019-10-14',
      content: 'Joined Milli Health'
    }, {
      id: uuid(),
      group: 1,
      type: 'range',
      end: '2019-10-16',
      editable: true,
      start: '2019-10-15',
      content: 'Recovered from gout'
    }, {
      id: uuid(),
      group: 1,
      type: 'range',
      end: '2019-10-17',
      editable: true,
      start: '2019-10-15',
      content: 'Recovered from amputation'
    }, {
      id: uuid(),
      group: 2,
      type: 'point',
      editable: true,
      start: '2019-10-16',
      content: 'Stubbed Toe'
    }, {
      id: uuid(),
      group: 2,
      type: 'point',
      editable: false,
      start: '2019-10-13',
      content: 'Lost favorite hat'
    }, {
      id: uuid(),
      group: 2,
      type: 'range',
      end: '2019-10-18',
      editable: true,
      start: '2019-10-17',
      content: 'Was in Coma'
    }],
    groups: [{
      id: 1,
      content: 'Category 1'
    }, {
      id: 2,
      content: 'Category 2'
    }]
  },
  'c545dde9-56e0-4260-a13d-cc25de10311b': {
    items: [{
      id: uuid(),
      type: 'point',
      start: '2019-10-14',
      content: 'Joined Milli Health'
    }],
    groups: []
  }
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.TIMELINE_DATUM_GENERATED: {
      const { patientId, datum } = action.payload

      if (newState[patientId]) newState[patientId].items.push(datum)
      else newState[patientId] = { items: [datum], groups: [] }
      break
    }
    case ActionKeys.TIMELINE_DATA_GENERATED: {
      const { patientId, data } = action.payload

      if (newState[patientId]) newState[patientId].items = newState[patientId].items.concat(data)
      else newState[patientId] = { items: data, groups: [] }
      break
    }
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
