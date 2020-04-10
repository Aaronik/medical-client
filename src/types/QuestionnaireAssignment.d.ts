import { TQuestionnaire } from 'types/Questionnaire'
import { TUser } from 'types/User'

export type QuestionnaireAssignment = {
  questionnaireId: number
  questionnaire?: TQuestionnaire
  assigneeId: number
  assignee?: TUser
  assignerId: number
}

