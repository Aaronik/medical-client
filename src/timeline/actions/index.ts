import { random } from 'lodash'
import uuid from 'uuid/v4'

import { dispatch } from 'store'
import * as T from 'timeline/types.d'

export const createNewRandomTimelineDatum = () => {
  const date = `2013-0${random(4, 5)}-${random(1, 30)}`

  const payload = {
    patientId: '0',
    datum: {
      id: uuid(),
      content: 'Here\'s a random new thing that happened on ' + date,
      start: date
    }
  }

  dispatch({ type: 'TIMELINE_DATUM_GENERATED', payload })
}

export const addTimelineData = (patientId: string, data: T.TTimelineDatum[]) => {
  const payload = { patientId, data }

  dispatch({ type: 'TIMELINE_DATA_GENERATED', payload })
}
