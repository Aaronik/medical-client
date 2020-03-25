export type TQuestion = {
  id?: number
  text: string
  type: string // TODO
  options?: TQuestionOption[]
  next?: any[] // TODO
}

export type TQuestionOption = {
  value: string
  text: string
}


