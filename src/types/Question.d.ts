// TODO It'd be really great to have these shared b/t repos
import { TTimelineItem } from 'types/Timeline.d'

export type TQuestion =
    BooleanQuestion
  | TextQuestion
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | EventQuestion

export interface BooleanQuestion extends QuestionMeta {
  type: 'BOOLEAN'
  boolResp?: Boolean
}

export interface TextQuestion extends QuestionMeta {
  type: 'TEXT'
  textResp?: string
}

export interface SingleChoiceQuestion extends QuestionMeta {
  type: 'SINGLE_CHOICE'
  options: QuestionOption[]
  singleChoiceResp?: QuestionOption
}

export interface MultipleChoiceQuestion extends QuestionMeta {
  type: 'MULTIPLE_CHOICE'
  options: QuestionOption[]
  multipleChoiceResp?: QuestionOption[]
}

export interface EventQuestion extends QuestionMeta {
  type: 'EVENT'
  eventResp?: TTimelineItem
}

export interface QuestionMeta {
  id: number
  questionnaireId?: number
  questionnaire?: Questionnaire
  text: string
  type: QuestionType
  options?: QuestionOption[]
  next: QuestionRelation[]
}

export type QuestionOption = {
  id?: number
  questionId?: number
  question?: TQuestion
  text: string
}

export type QuestionRelation = {
  questionId?: number
  question?: TQuestion
  nextQuestionId: number
  nextQuestion?: TQuestion
  includes?: string
  equals?: string
}

export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'BOOLEAN' | 'EVENT'

