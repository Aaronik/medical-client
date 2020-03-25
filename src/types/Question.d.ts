// TODO It'd be really great to have these shared b/t repos

export type Question =
    BooleanQuestion
  | TextQuestion
  | SingleChoiceQuestion
  | MultipleChoiceQuestion

export interface BooleanQuestion extends QuestionMeta {
  type: 'BOOLEAN'
  response?: Boolean
}

export interface TextQuestion extends QuestionMeta {
  type: 'TEXT'
  response?: string
}

export interface SingleChoiceQuestion extends QuestionMeta {
  type: 'SINGLE_CHOICE'
  options: QuestionOption[]
  response?: string
}

export interface MultipleChoiceQuestion extends QuestionMeta {
  type: 'MULTIPLE_CHOICE'
  options: QuestionOption[]
  response?: string[]
}

export interface QuestionMeta {
  id?: number
  questionnaireId?: number
  questionnaire?: Questionnaire
  text: string
  type: QuestionType
  options?: QuestionOption[]
  next?: QuestionRelation[]
}

export type QuestionOption = {
  id?: number
  questionId?: number
  question?: Question
  value: string
  text: string
}

export type QuestionRelation = {
  questionId?: number
  question?: Question
  nextQuestionId: number
  nextQuestion?: Question
  includes?: string
  equals?: string
}

export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'BOOLEAN'

