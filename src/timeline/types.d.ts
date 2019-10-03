export type TTimelineDatum = {
  id: string
  content: string
  start: string
  end?: string
}

export type TBranchState = TTimelineDatum[]

export type TAction =
  { type: 'TIMELINE_DATA_GENERATED', payload: TTimelineDatum } |
  { type: 'STUB' }
