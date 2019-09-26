export type TTimelineDatum = {
  id: string
  content: string
  start: string
  end?: string
}

export type TBranchState = TTimelineDatum[]

export type TAction =
  { type: 'RANDOM_TIMELINE_DATUM_GENERATED', datum: TTimelineDatum } |
  { type: 'STUB' }
