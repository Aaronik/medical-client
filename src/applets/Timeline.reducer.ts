import uuid from 'uuid/v4'
import { cloneDeep, times, random } from 'lodash'
import * as T from './Timeline.d'
import { ActionKeys } from 'common/actionKeys'
import * as faker from 'faker'

const GROUP_STYLE = 'max-width: 15vw; padding-left: 0px'
const BMID = 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9'
const EJID = 'c545dde9-56e0-4260-a13d-cc25de10311b'

const startingState: T.TBranchState = {
  [BMID]: {
    items: [],
    groups: []
  },
  [EJID]: {
    items: [{
      id: uuid(),
      type: 'point',
      start: '2019-10-14',
      content: 'Joined Milli Health',
      group: 9
    }],
    groups: [{
      id: 9,
      content: 'Category 9'
    }]
  }
}

// Takes an array, returns a random member of that array
const randomOf = <T>(...array: T[]): T => {
  const idx = Math.floor(Math.random() * array.length)
  return array[idx]
}

// Add groups
times(20, idx => {
  startingState[BMID].groups.push({
    id: idx,
    content: faker.lorem.word(),
    style: GROUP_STYLE,
  })
})

// Add timeline items
times(300, () => {
  startingState[BMID].items.push({
    id: uuid(),
    type: randomOf('range', 'point'),
    start: faker.date.past(20),
    end: faker.date.future(),
    content: faker.lorem.words(),
    group: random(20)
  })
})

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.TIMELINE_ITEM_ADDED: {
      const { patientId, item } = action.payload

      if (newState[patientId]) newState[patientId].items.push(item)
      else newState[patientId] = { items: [item], groups: [] }
      break
    }
    case ActionKeys.TIMELINE_ITEM_UPDATED: {
      const { patientId, item } = action.payload

      const idx = newState[patientId].items.findIndex(i => i.id === item.id)
      newState[patientId].items[idx] = item
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
