import React, { useState } from 'react'
import { ApolloError, DocumentNode } from '@apollo/client'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import FormInput from 'components/FormInput'
import { SUBMIT_BOOLEAN_RESPONSE, SUBMIT_TEXT_RESPONSE, SUBMIT_CHOICE_RESPONSE, SUBMIT_CHOICE_RESPONSES, SUBMIT_EVENT_RESPONSE } from 'util/queries'
import onKeyDown from 'util/onKeyDown'
import filterVisibleQuestions from 'util/filterVisibleQuestions'
import { useMutation } from '@apollo/client'
import { TQuestionnaire } from 'types/Questionnaire.d'
import * as Q from 'types/Question.d'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'
import DatePickerModal from 'components/DatePickerModal'

type QuestionnaireProps = {
  questionnaire: TQuestionnaire
  isAnswerable?: boolean
  QuestionnaireButtons?: React.FC<{}>
  QuestionButtons?: TQuestionTitleAdditions
  questionResponseRefetchQuery?: DocumentNode
  className?: string
}

const Questionnaire: React.FC<QuestionnaireProps> = (props) => {
  const { questionnaire, isAnswerable, QuestionnaireButtons, QuestionButtons, questionResponseRefetchQuery, className } = props

  const [ isExpanded, setIsExpanded ] = useState(true) // TODO

  const headerStyle = {
    cursor: 'pointer',
  }

  if (!isExpanded) return (
    <Card className={className}>
      <Card.Header style={headerStyle} onClick={() => setIsExpanded(true)}>
        <Row className='align-items-center'>
          <h4 className='m-2'>{questionnaire.title}</h4>
        </Row>
      </Card.Header>
    </Card>
  )

  const questions = props.isAnswerable
    ? filterVisibleQuestions(orderQuestions(questionnaire.questions))
    : orderQuestions(questionnaire.questions)

  return (
    <Card className={className}>
      <Card.Header style={headerStyle} onClick={() => setIsExpanded(false)}>
        <Row className='align-items-center'>
          <h4 className='m-2'>{questionnaire.title}</h4>
          { QuestionnaireButtons && <QuestionnaireButtons/> }
        </Row>
      </Card.Header>
      <Card.Body>
      <ListGroup className='list-group-flush'>
      {
        questions.map((q: Q.TQuestion) => {
          const Component = questionTypeMap(q.type)
          return (
            <ListGroupItem key={q.id}>
              <Component
                TitleAdditions={QuestionButtons}
                question={q}
                key={q.id}
                readOnly={isAnswerable === false}
                refetchQ={questionResponseRefetchQuery}
                assignmentInstanceId={questionnaire.assignmentInstanceId}/>
            </ListGroupItem>
          )
        })
      }
      </ListGroup>
      </Card.Body>
      { !props.isAnswerable &&
        <Card.Footer>
          <code>{JSON.stringify(questionnaire.questions.map(q => q.next))}</code>
        </Card.Footer>
      }
    </Card>
  )
}

export default Questionnaire

// This takes a bunch of questions and orders them based on {next} values.
// So if a question is referenced by another question's next, this function
// will sort the question to the position after the question it's referenced by.
const orderQuestions = (questions: Q.TQuestion[]): Q.TQuestion[] => {
  let orderedQuestions: Q.TQuestion[] = []

  const getFirstNextIndex = (id: number) => orderedQuestions.findIndex(orderedQuestion => {
    return orderedQuestion.next.some(next => next.nextQuestionId === id)
  })

  questions.forEach(question => {
    // * Go through orderedQuestions and find any nexts for this question
    // * If found, insert this question after it
    // * If not found, this question goes at the end.
    const index = getFirstNextIndex(question.id)

    if (index === -1) {
      orderedQuestions.push(question)
    } else {
      orderedQuestions.splice(index + 1, 0, question)
    }

  })

  return orderedQuestions
}

const questionSubmissionMutationOptions = (refetchQ?: DocumentNode) => {
  const opts = { onError: console.error }
  if (refetchQ) Object.assign(opts, { refetchQueries: [{ query: refetchQ }]})
  return opts
}

type TQuestionTitleAdditions = React.FC<{ question: Q.TQuestion }>

type CommonQuestionProps = {
  assignmentInstanceId: number
  readOnly?: boolean
  TitleAdditions?: TQuestionTitleAdditions
  refetchQ?: DocumentNode
}

type TextQuestionProps = {
  question: Q.TextQuestion
} & CommonQuestionProps

const TextQuestion: React.FC<TextQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ, assignmentInstanceId }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.textResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.textResp || '')
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_TEXT_RESPONSE, questionSubmissionMutationOptions(refetchQ))

  const onChange = (text: string) => {
    if (readOnly) return
    setCurrentResponse(text)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    if (readOnly) return
    respondToQuestion({ variables: { questionId: question.id, value: currentResponse, assignmentInstanceId }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div onKeyDown={onKeyDown('Enter', onSave)}>
      <Form.Label>
        <Row className='align-items-center'>
          <h5 className='mr-1'>{question.text}</h5>
        </Row>
      </Form.Label>
      <FormInput
        type='text'
        label=''
        value={currentResponse}
        onChange={onChange}
      />
      <ButtonRow readOnly={readOnly} error={error} loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}>
        <div></div>
        {TitleAdditions && <div><TitleAdditions question={question}/></div>}
      </ButtonRow>
    </div>
  )
}

type BoolQuestionProps = {
  question: Q.BooleanQuestion
} & CommonQuestionProps

const BoolQuestion: React.FC<BoolQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ, assignmentInstanceId }) => {
  const hasResponse = question.boolResp === true || question.boolResp === false

  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!hasResponse)
  const [ currentResponse, setCurrentResponse ] = useState(question.boolResp)
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_BOOLEAN_RESPONSE, questionSubmissionMutationOptions(refetchQ))

  const onChange = (b: unknown) => {
    if (readOnly) return
    setCurrentResponse(b as boolean)
    onSave(b as boolean)
  }

  const onSave = (b?: boolean) => {
    if (readOnly) return
    // setting currentResponse and then saving immediately after results in saving the previous
    // value of currentResponse -- it doesn't have time to update yet. This is to circumvent that.
    const value = b === undefined ? currentResponse : b
    respondToQuestion({ variables: { questionId: question.id, value, assignmentInstanceId }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
      <Form.Label>
        <Row className='align-items-center'>
          <h5 className='mr-1'>{question.text}</h5>
        </Row>
      </Form.Label>
      <ButtonRow readOnly={readOnly} error={error} loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={() => onSave()}>
        <ToggleButtonGroup name='what' type='radio' value={currentResponse} onChange={onChange}>
          <ToggleButton value={true}>Yes</ToggleButton>
          <ToggleButton value={false}>No</ToggleButton>
        </ToggleButtonGroup>
        {TitleAdditions && <div><TitleAdditions question={question}/></div>}
      </ButtonRow>
    </div>
  )
}

type SingleChoiceQuestionProps = {
  question: Q.SingleChoiceQuestion
} & CommonQuestionProps

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ, assignmentInstanceId }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.singleChoiceResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.singleChoiceResp?.id)
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_CHOICE_RESPONSE, questionSubmissionMutationOptions(refetchQ))

  const onChange = (optionId: number) => {
    if (readOnly) return
    setCurrentResponse(optionId)
    onSave(optionId)
  }

  const onSave = (optionId?: number) => {
    if (readOnly) return
    // setting currentResponse and then saving immediately after results in saving the previous
    // value of currentResponse -- it doesn't have time to update yet. This is to circumvent that.
    const finalOptionId = optionId === undefined ? currentResponse : optionId
    respondToQuestion({ variables: { questionId: question.id, optionId: finalOptionId, assignmentInstanceId }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
      <Form.Label>
        <Row className='align-items-center'>
          <h5 className='mr-1'>{question.text}</h5>
        </Row>
      </Form.Label>
      <ButtonRow readOnly={readOnly} error={error} loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={() => onSave()}>
        <ToggleButtonGroup name='Single choice button group' type='radio' value={currentResponse} onChange={onChange}>
          {
            question.options.map(option => <ToggleButton key={option.id} value={option.id}>{option.text}</ToggleButton>)
          }
        </ToggleButtonGroup>
        {TitleAdditions && <div><TitleAdditions question={question}/></div>}
      </ButtonRow>
    </div>
  )
}

type MultipleChoiceQuestionProps = {
  question: Q.MultipleChoiceQuestion
} & CommonQuestionProps

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ, assignmentInstanceId }) => {
  const initialCurrentOptionIds = (question.multipleChoiceResp?.map(option => option.id) || []) as number[]

  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.multipleChoiceResp?.length)
  const [ currentOptionIds, setCurrentOptionIds ] = useState(initialCurrentOptionIds)
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_CHOICE_RESPONSES, questionSubmissionMutationOptions(refetchQ))

  const onChange = (optionIds: number[]) => {
    if (readOnly) return
    setCurrentOptionIds(optionIds)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    if (readOnly) return
    respondToQuestion({ variables: { questionId: question.id, optionIds: currentOptionIds, assignmentInstanceId }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div onKeyDown={onKeyDown('Enter', onSave)}>
      <Form.Label>
        <Row className='align-items-center'>
          <h5 className='mr-1'>{question.text}</h5>
        </Row>
      </Form.Label>
      <ButtonRow readOnly={readOnly} error={error} loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}>
        <ToggleButtonGroup type='checkbox' value={currentOptionIds} onChange={onChange}>
          {
            question.options.map(option => <ToggleButton key={option.id} value={option.id}>{option.text}</ToggleButton>)
          }
        </ToggleButtonGroup>
        {TitleAdditions && <div><TitleAdditions question={question}/></div>}
      </ButtonRow>
    </div>
  )
}

type EventQuestionProps = {
  question: Q.EventQuestion
} & CommonQuestionProps

const EventQuestion: React.FC<EventQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ, assignmentInstanceId }) => {

  const initialStart = question.eventResp?.start ? new Date(Number(question.eventResp.start)) : undefined
  const initialEnd = question.eventResp?.end ? new Date(Number(question.eventResp.end)): undefined

  const [ start, setStart ] = useState(initialStart)
  const [ end, setEnd ] = useState(initialEnd)
  const [ isStartModalOpen, setIsStartModalOpen ] = useState(false)
  const [ isEndModalOpen, setIsEndModalOpen ] = useState(false)
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.eventResp)
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_EVENT_RESPONSE, questionSubmissionMutationOptions(refetchQ))

  const onSave = () => {
    if (readOnly) return
    respondToQuestion({ variables: {
      questionId: question.id,
      assignmentInstanceId: assignmentInstanceId,
      event: { start, end, title: question.text, details: '' }
    }})
    setHasChangedSinceLastSave(false)
  }

  const onStartClick = () => {
    if (readOnly) return
    setIsStartModalOpen(true)
  }

  const onEndClick = () => {
    if (readOnly) return
    setIsEndModalOpen(true)
  }

  const onStartDateSelect = (date: Date) => {
    if (readOnly) return
    setStart(date)
    setHasChangedSinceLastSave(true)
  }

  const onEndDateSelect = (date: Date) => {
    if (readOnly) return
    setEnd(date)
    setHasChangedSinceLastSave(true)
  }

  const startString = start?.toLocaleDateString()
  const endString = end?.toLocaleDateString()

  return (
    <div onKeyDown={onKeyDown('Enter', onSave)}>
      <Form.Label>
        <Row className='align-items-center'>
          <h5 className='mr-1'>{question.text}</h5>
        </Row>
      </Form.Label>
      <ButtonRow readOnly={readOnly} error={error} loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}>
        <ButtonGroup>
          <Button active={!!startString} onClick={onStartClick}>{startString || 'Select start date'}</Button>
          <Button active={!!endString} onClick={onEndClick}>{endString || 'Select end date'}</Button>
        </ButtonGroup>
        {TitleAdditions && <div><TitleAdditions question={question}/></div>}
      </ButtonRow>

      <DatePickerModal
        show={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        initialDate={start}
        onSelect={onStartDateSelect}
      />
      <DatePickerModal
        show={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        initialDate={end}
        onSelect={onEndDateSelect}
      />
    </div>
  )
}

const questionTypeMap = (type: Q.QuestionType): React.FC<any> => ({
  TEXT: TextQuestion,
  BOOLEAN: BoolQuestion,
  SINGLE_CHOICE: SingleChoiceQuestion,
  MULTIPLE_CHOICE: MultipleChoiceQuestion,
  EVENT: EventQuestion
}[type])

type ButtonRowProps = {
  error?: ApolloError
  loading: boolean
  hasChangedSinceLastSave: boolean
  onSave: () => void
  readOnly?: boolean
}

const ButtonRow: React.FC<ButtonRowProps> = ({ error, loading, hasChangedSinceLastSave, onSave, children, readOnly }) => {

  const buttonValue = hasChangedSinceLastSave
    ? 'Save'
    : error
      ? <FontAwesomeIcon icon={faExclamation} className='icon' size='lg'/>
      : loading
        ? <Spinner animation='grow' size={'sm'}/>
        :  <FontAwesomeIcon icon={faCheck} className='icon' size='lg'/>

  const buttonVariant = hasChangedSinceLastSave
    ? 'primary'
    : error
      ? 'danger'
      : loading
        ? 'secondary'
        : 'success'

  const justify = !!children
    ? 'justify-content-between'
    : 'justify-content-end'

  return (
    <Row className={'d-flex mr-3 ' + justify} >
      { children }
      { readOnly ||
        <div className='d-flex flex-row'>
          <p className='text-danger mr-3'>{error?.message}</p>
          <Button variant={buttonVariant} onClick={onSave}>{buttonValue}</Button>
        </div>
      }
    </Row>
  )
}


