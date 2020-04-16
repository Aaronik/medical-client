import { TQuestionnaire } from 'types/Questionnaire.d'
import omitDeep from 'omit-deep-lodash'

const withoutResponses = (questionnaire: TQuestionnaire) => {
  questionnaire = omitDeep(questionnaire, ['boolResp', 'textResp', 'singleChoiceResp', 'multipleChoiceResp'])
  return questionnaire
}

export default withoutResponses
