import React, { useState } from 'react'
import { ApolloError } from '@apollo/client'
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
  QuestionnaireTitleAdditions?: React.FC<{}>
  QuestionTitleAdditions?: TQuestionTitleAdditions
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questionnaire, isAnswerable, QuestionnaireTitleAdditions, QuestionTitleAdditions }) => {

  const [ isExpanded, setIsExpanded ] = useState(true)

  const headerStyle = {
    cursor: 'pointer',
  }

  if (!isExpanded) return (
    <Card style={headerStyle} onClick={() => setIsExpanded(true)}>
      <Card.Header><h4>{questionnaire.title}</h4></Card.Header>
    </Card>
  )

  return (
    <Card>
      <Card.Header style={headerStyle} onClick={() => setIsExpanded(false)}>
        <Row className='align-items-center'>
          <h4 className='m-2'>{questionnaire.title}</h4>
          { QuestionnaireTitleAdditions && <QuestionnaireTitleAdditions/> }
        </Row>
      </Card.Header>
      <Card.Body>
      <ListGroup className='list-group-flush'>
      {
        questionnaire.questions.map((q: Q.Question) => {
          const Component = questionTypeMap(q.type)
          return (
            <ListGroupItem key={q.id}>
              <Component TitleAdditions={QuestionTitleAdditions} question={q} key={q.id} readOnly={isAnswerable === false}/>
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

type TQuestionTitleAdditions = React.FC<{ question: Q.Question }>

type CommonQuestionProps = {
  readOnly?: boolean
  TitleAdditions?: TQuestionTitleAdditions
}

type TextQuestionProps = {
  question: Q.TextQuestion
} & CommonQuestionProps

const TextQuestion: React.FC<TextQuestionProps> = ({ question, readOnly, TitleAdditions }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.textResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.textResp || '')
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_TEXT_RESPONSE, { onError: console.error })

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

const BoolQuestion: React.FC<BoolQuestionProps> = ({ question, readOnly, TitleAdditions }) => {
  const hasResponse = question.boolResp === true || question.boolResp === false

  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!hasResponse)
  const [ currentResponse, setCurrentResponse ] = useState(question.boolResp)
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_BOOLEAN_RESPONSE, { onError: console.error })

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

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ question, readOnly, TitleAdditions }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.singleChoiceResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.singleChoiceResp || null)
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_CHOICE_RESPONSE, { onError: console.error })

  const onChange = (b: unknown) => {
    if (readOnly) return
    setCurrentResponse(b as string)
    onSave(b as string)
  }

  const onSave = (b?: string) => {
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
        <ToggleButtonGroup name='Single choice button group' type='radio' value={currentResponse} onChange={onChange}>
          {
            question.options.map(option => <ToggleButton key={option.value} value={option.value}>{option.text}</ToggleButton>)
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

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, readOnly, TitleAdditions }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.multipleChoiceResp?.length)
  const [ currentResponses, setCurrentResponse ] = useState(question.multipleChoiceResp || [])
  const [ respondToQuestion, { loading, error } ] = useMutation(SUBMIT_CHOICE_RESPONSES, { onError: console.error })

  const onChange = (resp: string[]) => {
    if (readOnly) return
    setCurrentResponse(resp)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    if (readOnly) return
    respondToQuestion({ variables: { questionId: question.id, values: currentResponses }})
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
        <ToggleButtonGroup type='checkbox' value={currentResponses} onChange={onChange}>
          {
            question.options.map(option => <ToggleButton key={option.value} value={option.value}>{option.text}</ToggleButton>)
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

