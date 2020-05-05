import * as Q from 'types/Question'

// Is this question referenced by another question somewhere in that other question's next[]'s?
const questionHasForeignRef = (question: Q.TQuestion, questions: Q.TQuestion[]): Boolean => {
  return questions.some(otherQuestion => {
    return otherQuestion.next?.some(next => {
      return next.nextQuestionId === question.id
    })
  })
}

// Does the answer to this question match another question's next's includes or equals?
// In other words, are other questions answered sufficiently so that this one should be
// visible?
const questionMatchesIncludesOrEquals = (question: Q.TQuestion, questions: Q.TQuestion[]): Boolean => {
  let matches = false

  questions.forEach(otherQuestion => {
    otherQuestion.next?.forEach(next => {
      // This is not a next question to this other question
      if (next.nextQuestionId !== question.id) return

      let resp

      if (otherQuestion.type === 'BOOLEAN') {
        resp = otherQuestion.boolResp
      } else if (otherQuestion.type === 'TEXT') {
        resp = otherQuestion.textResp
      } else if (otherQuestion.type === 'SINGLE_CHOICE') {
        resp = otherQuestion.singleChoiceResp
      } else if (otherQuestion.type === 'MULTIPLE_CHOICE') {
        resp = otherQuestion.multipleChoiceResp
      } else if (otherQuestion.type === 'EVENT') {
        resp = otherQuestion.eventResp
      }

      const includesIndex = resp?.toString().indexOf(next.includes as string)
      const matchesIncludes = next.includes !== "" && includesIndex !== -1 && includesIndex !== undefined
      const matchesEquals = next.equals !== "" && resp?.toString() === next.equals

      // If next.includes is included in the answer, or if the answer exactly equals next.equals
      if (matchesIncludes || matchesEquals) matches = true
      else                                  matches = false

    })
  })

  return matches
}

// Based on questions' next[] arrays, which questions are "visible", aka
// either have no foreign references by other questions, or have some that
// are sufficiently answered given their .includes and .equals fields.
const filterVisibleQuestions = (questions: Q.TQuestion[]): Q.TQuestion[] => {
  return questions.map(currentQuestion => {

    // Question is visible if:
    // 1) Any other question has matching includes/equals, or
    // 2) No other question has a reference to it.

    // If no other question has a reference to this one, it's visible
    if (!questionHasForeignRef(currentQuestion, questions)) return currentQuestion

    const isVisible = questionMatchesIncludesOrEquals(currentQuestion, questions)

    if (isVisible) return currentQuestion
    else return false as unknown as Q.TQuestion // we're forcing false into TQuestion here but then immediately removing it with filter(Boolean).
  }).filter(Boolean)
}

export default filterVisibleQuestions
