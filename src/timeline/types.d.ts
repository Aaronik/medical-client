import { ActionKeys } from 'common/action-keys'
import timeline from 'vis-timeline'

export type TTimelineDatum = timeline.TimelineData

export type TTimelineGroup = timeline.TimelineGroup

export type TBranchState = {
  [patientId: string]: {
    items: TTimelineDatum[]
    groups: TTimelineGroup[]
  }
}

export type TAction =
  { type: ActionKeys.TIMELINE_DATA_GENERATED, payload: { patientId: string, data: TTimelineDatum[] }} |
  { type: ActionKeys.TIMELINE_DATUM_GENERATED, payload: { patientId: string, datum: TTimelineDatum }}
