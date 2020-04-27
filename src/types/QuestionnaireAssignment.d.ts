import { TQuestionnaire } from 'types/Questionnaire'
import { TUser } from 'types/User'

export type QuestionnaireAssignment = {
  id: number
  created: Date
  repeatInterval: number // in minutes
  questionnaireId: number
  questionnaire?: TQuestionnaire
  assigneeId: number
  assignee?: TUser
  assignerId: number
}

