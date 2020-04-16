import Question from 'types/Question.d'

export type TQuestionnaire = {
  id: number
  title: string
  questions: Question[]
  next: any[]
}

