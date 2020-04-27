import { TQuestion } from 'types/Question.d'

export type TQuestionnaire = {
  id: number
  title: string
  assignmentInstanceId: number
  questions: TQuestion[]
  next: any[]
}

