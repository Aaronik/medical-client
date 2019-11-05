import { random } from 'lodash'
import uuid from 'uuid/v4'

import { dispatch } from 'store'
import * as T from 'timeline/types.d'
import { ActionKeys } from 'common/action-keys'

export const createNewRandomTimelineDatum = () => {
  const date = `2013-0${random(4, 5)}-${random(1, 30)}`

  const payload = {
    patientId: '0',
    datum: {
      id: uuid(),
      content: 'Here\'s a random new thing that happened on ' + date,
      start: date,
      group: 1,
    }
  }

  dispatch({ type: ActionKeys.TIMELINE_DATUM_GENERATED, payload })
}

export const addTimelineData = (patientId: string, data: T.TTimelineDatum[]) => {
  const payload = { patientId, data }

  dispatch({ type: ActionKeys.TIMELINE_DATA_GENERATED, payload })
}
