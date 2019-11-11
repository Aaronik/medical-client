import { dispatch } from 'store'
import * as T from 'timeline/types.d'
import { ActionKeys } from 'common/action-keys'

export const addTimelineItem = (patientId: string, item: T.TTimelineItem) => {
  const payload = { patientId, item }

  dispatch({ type: ActionKeys.TIMELINE_ITEM_ADDED, payload })
}
