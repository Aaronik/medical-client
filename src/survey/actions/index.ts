import uuid from 'uuid/v4'

import { dispatch } from 'store'
import * as T from 'survey/types.d'
import { TTimelineDatum } from 'timeline/types.d'

export const saveSurvey = (surveyResult: T.TSurveyResult) => {

  // ATTOW this is unused, but important so that survey reducers can
  // do their thing if needed.
  dispatch({ type: 'SURVEY_COMPLETED', payload: surveyResult })

  // This is not going to live forever, but for the time being
  // we're just going to directly populate some timeline data
  // as a proof of concept.
  surveyResult.events.forEach(event => {
    const timelineDatum: TTimelineDatum = {
      start: event.date,
      content: event.description,
      id: uuid()
    }

    dispatch({ type: 'TIMELINE_DATA_GENERATED', payload: timelineDatum })
  })
}
