import { ActionKeys } from 'common/action-keys'

export type TTimelineDatum = {
  id: string
  content: string      // contents of box
  start: string        // location on timeline
  end?: string
  title?: string       // shown on mouse over
  style?: string
  group?: string       // id of group it's in
  editable?: boolean
  type?: 'box' // default
    | 'point'  //
    | 'range'  // requires start and end
    | 'background' // requires start and end
}

export type TTimelineGroup = {
  id: string
  className?: string
  content?: string
  title?: string
  style?: string
}

export type TBranchState = {
  [patientId: string]: TTimelineDatum[]
}

export type TAction =
  { type: ActionKeys.TIMELINE_DATA_GENERATED, payload: { patientId: string, data: TTimelineDatum[] }} |
  { type: ActionKeys.TIMELINE_DATUM_GENERATED, payload: { patientId: string, datum: TTimelineDatum }}
