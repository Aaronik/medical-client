import { ActionKeys } from 'common/action-keys'
import * as timeline from 'vis-timeline'

export type TTimelineItem = timeline.TimelineItem

export type TTimelineGroup = timeline.TimelineGroup

export type TBranchState = {
  [patientId: string]: {
    items: TTimelineItem[]
    groups: TTimelineGroup[]
  }
}

export type TAction =
  { type: ActionKeys.TIMELINE_ITEM_ADDED, payload: { patientId: string, item: TTimelineItem }}
