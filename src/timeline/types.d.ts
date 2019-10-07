export type TTimelineDatum = {
  id: string
  content: string
  start: string
  end?: string
}

export type TBranchState = {
  [patientId: string]: TTimelineDatum[]
}

export type TAction =
  { type: 'TIMELINE_DATA_GENERATED', payload: { patientId: string, data: TTimelineDatum[] }} |
  { type: 'TIMELINE_DATUM_GENERATED', payload: { patientId: string, datum: TTimelineDatum }}
