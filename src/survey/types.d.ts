export type TBranchState = {

}

export type TSurveyResult = {
  name: {
    first: string
    middle?: string
    last: string
  },
  events: {
    description: string
    date: string // yyyy-mm-dd
  }[]
}

export type TAction =
  { type: 'SURVEY_COMPLETED', payload: TSurveyResult }

