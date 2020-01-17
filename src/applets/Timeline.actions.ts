import { dispatch } from 'common/store'
import * as T from './Timeline.d'
import { ActionKeys } from 'common/actionKeys'

export const addTimelineItem = (patientId: string, item: T.TTimelineItem) => {
  const payload = { patientId, item }
  dispatch({ type: ActionKeys.TIMELINE_ITEM_ADDED, payload })
}

export const updateTimelineItem = (patientId: string, item: T.TTimelineItem) => {
  const payload = { patientId, item }
  dispatch({ type: ActionKeys.TIMELINE_ITEM_UPDATED, payload })
}
