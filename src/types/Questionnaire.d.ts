import { TQuestion } from 'types/Question.d'

export type TQuestionnaire = {
  id: number
  title: string
  questions: TQuestion[]
  next: any[]
}

