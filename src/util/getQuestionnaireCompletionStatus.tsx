import React from 'react'
import { TQuestionnaire } from 'types/Questionnaire'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import filterVisibleQuestions from 'util/filterVisibleQuestions'

const getQuestionnaireCompletionStatus = (questionnaire: TQuestionnaire): CompletionStatus => {
  const questions = filterVisibleQuestions(questionnaire.questions)

  // an array of booleans indicating whether the question has an answer
  const bools = questions.map(q => {
    if (q.type === 'TEXT' && !!q.textResp) return true
    if (q.type === 'BOOLEAN' && (q.boolResp === true || q.boolResp === false)) return true
    if (q.type === 'SINGLE_CHOICE' && !!q.singleChoiceResp) return true
    if (q.type === 'MULTIPLE_CHOICE' && q.multipleChoiceResp?.length !== 0) return true
    if (q.type === 'EVENT' && !!q.eventResp) return true
    return false
  })

  return allTrue(bools) ? 'COMPLETED' : allFalse(bools) ? 'UNSTARTED' : 'IN_PROGRESS'
}

type CompletionStatus = 'UNSTARTED' | 'IN_PROGRESS' | 'COMPLETED'

export default getQuestionnaireCompletionStatus

export const getQuestionnaireCompletionStatusIcon = (questionnaire: TQuestionnaire) => {
  const completionStatus = getQuestionnaireCompletionStatus(questionnaire)

  const completionIcon = completionStatus === 'UNSTARTED'
    ? <FontAwesomeIcon icon={icons.faEllipsisH} size='2x' className='text-secondary'/>
    : completionStatus === 'IN_PROGRESS'
      ? <FontAwesomeIcon icon={icons.faSpinner} size='2x' className='text-warning'/>
      : <FontAwesomeIcon icon={icons.faCheckCircle} size='2x' className='text-success'/>

  return completionIcon
}

const allTrue = (bools: boolean[]) => {
  return bools.every(bool => bool)
}

const allFalse = (bools: boolean[]) => {
  return bools.every(bool => !bool)
}
