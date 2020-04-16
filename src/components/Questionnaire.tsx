import React, { useState } from 'react'
import { ApolloError, DocumentNode } from '@apollo/client'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import FormInput from 'components/FormInput'
import { SUBMIT_BOOLEAN_RESPONSE, SUBMIT_TEXT_RESPONSE, SUBMIT_CHOICE_RESPONSE, SUBMIT_CHOICE_RESPONSES } from 'util/queries'
import { useMutation } from '@apollo/client'
import { TQuestionnaire } from 'types/Questionnaire.d'
import * as Q from 'types/Question.d'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons' // TODO narrow

type QuestionnaireProps = {
  questionnaire: TQuestionnaire
  isAnswerable?: boolean
  QuestionnaireButtons?: React.FC<{}>
  QuestionButtons?: TQuestionTitleAdditions
  questionResponseRefetchQuery?: DocumentNode
}

const Questionnaire: React.FC<QuestionnaireProps> = (props) => {
  const { questionnaire, isAnswerable, QuestionnaireButtons, QuestionButtons, questionResponseRefetchQuery } = props

  const [ isExpanded, setIsExpanded ] = useState(false)

  const headerStyle = {
    cursor: 'pointer',
  }

  if (!isExpanded) return (
    <Card>
      <Card.Header style={headerStyle} onClick={() => setIsExpanded(true)}>
        <Row className='align-items-center'>
          <h4 className='m-2'>{questionnaire.title}</h4>
        </Row>
      </Card.Header>
    </Card>
  )

  return (
    <Card>
      <Card.Header style={headerStyle} onClick={() => setIsExpanded(false)}>
        <Row className='align-items-center'>
          <h4 className='m-2'>{questionnaire.title}</h4>
          { QuestionnaireButtons && <QuestionnaireButtons/> }
        </Row>
      </Card.Header>
      <Card.Body>
      <ListGroup className='list-group-flush'>
      {
        questionnaire.questions.map((q: Q.Question) => {
          const Component = questionTypeMap(q.type)
          return (
            <ListGroupItem key={q.id}>
              <Component TitleAdditions={QuestionButtons} question={q} key={q.id} readOnly={isAnswerable === false} refetchQ={questionResponseRefetchQuery}/>
            </ListGroupItem>
          )
        })
      }
      </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default Questionnaire

const questionSubmissionMutationOptions = (refetchQ?: DocumentNode) => {
  const opts = { onError: console.error }
  if (refetchQ) Object.assign(opts, { refetchQueries: [{ query: refetchQ }]})
  return opts
}

type TQuestionTitleAdditions = React.FC<{ question: Q.Question }>

type CommonQuestionProps = {
  readOnly?: boolean
  TitleAdditions?: TQuestionTitleAdditions
  refetchQ?: DocumentNode
}

type TextQuestionProps = {
  question: Q.TextQuestion
} & CommonQuestionProps

const TextQuestion: React.FC<TextQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ }) => {
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
    respondToQuestion({ variables: { questionId: question.id, value: currentResponse }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
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

const BoolQuestion: React.FC<BoolQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ }) => {
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
    respondToQuestion({ variables: { questionId: question.id, value }})
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

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ }) => {
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
    respondToQuestion({ variables: { questionId: question.id, optionId: finalOptionId }})
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

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, readOnly, TitleAdditions, refetchQ }) => {
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
    respondToQuestion({ variables: { questionId: question.id, optionIds: currentOptionIds }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
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

const questionTypeMap = (type: Q.QuestionType): React.FC<any> => ({
  TEXT: TextQuestion,
  BOOLEAN: BoolQuestion,
  SINGLE_CHOICE: SingleChoiceQuestion,
  MULTIPLE_CHOICE: MultipleChoiceQuestion
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


