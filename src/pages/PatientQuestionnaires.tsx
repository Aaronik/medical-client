import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Loading from 'pages/Loading'
import ErrorPage from 'pages/Error'
import FormInput from 'components/FormInput'
import { GET_ALL_QUESTIONNAIRES, SUBMIT_BOOLEAN_RESPONSE, SUBMIT_TEXT_RESPONSE, SUBMIT_CHOICE_RESPONSE, SUBMIT_CHOICE_RESPONSES } from 'util/queries'
import { useQuery, useMutation } from '@apollo/client'
import { TQuestionnaire } from 'types/Questionnaire.d'
import * as Q from 'types/Question.d'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons' // TODO narrow

const PatientQuestionnaires: React.FunctionComponent = () => {
  const { data, loading, error } = useQuery(GET_ALL_QUESTIONNAIRES)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>

  const questionnaires = data.questionnaires

  if (!questionnaires.length) return <h2>No questionnaires!</h2>

  return (
    <Container>
      <h1>Patient Questionnaires</h1>
      <hr/>
      { questionnaires.map((q: TQuestionnaire) => <Questionnaire questionnaire={q} key={q.id}/>)}
    </Container>
  )
}

export default PatientQuestionnaires

type QuestionnaireProps = {
  questionnaire: TQuestionnaire
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questionnaire }) => {

  const [ isExpanded, setIsExpanded ] = useState(true)

  const headerStyle = {
    cursor: 'pointer',
  }

  if (!isExpanded) return (
    <Card style={headerStyle} onClick={() => setIsExpanded(true)}>
      <Card.Header>{questionnaire.title}</Card.Header>
    </Card>
  )

  return (
    <Card>
      <Card.Header style={headerStyle} onClick={() => setIsExpanded(false)}>{questionnaire.title}</Card.Header>
      <Card.Body>
      <ListGroup className='list-group-flush'>
      {
        questionnaire.questions.map((q: Q.Question) => {
          const Component = questionTypeMap(q.type)
          return (
            <ListGroupItem>
              <Component question={q} key={q.id}/>
            </ListGroupItem>
          )
        })
      }
      </ListGroup>
      </Card.Body>
    </Card>
  )
}

type TextQuestionProps = {
  question: Q.TextQuestion
}

const TextQuestion: React.FC<TextQuestionProps> = ({ question }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.textResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.textResp || '')
  const [ respondToQuestion, { loading } ] = useMutation(SUBMIT_TEXT_RESPONSE)

  const onChange = (text: string) => {
    setCurrentResponse(text)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    respondToQuestion({ variables: { questionId: question.id, value: currentResponse }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
      <FormInput
        type='text'
        label={question.text}
        value={currentResponse}
        onChange={onChange}
      />
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}/>
    </div>
  )
}

type BoolQuestionProps = {
  question: Q.BooleanQuestion
}

const BoolQuestion: React.FC<BoolQuestionProps> = ({ question }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.boolResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.boolResp || null)
  const [ respondToQuestion, { loading } ] = useMutation(SUBMIT_BOOLEAN_RESPONSE)

  const onChange = (b: unknown) => {
    setCurrentResponse(b as boolean)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    respondToQuestion({ variables: { questionId: question.id, value: currentResponse }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
      <Form.Label>{question.text}</Form.Label>
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}>
        <ToggleButtonGroup name='what' type='radio' value={currentResponse} onChange={onChange}>
          <ToggleButton value={true}>Yes</ToggleButton>
          <ToggleButton value={false}>No</ToggleButton>
        </ToggleButtonGroup>
      </ButtonRow>
    </div>
  )
}

type SingleChoiceQuestionProps = {
  question: Q.SingleChoiceQuestion
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ question }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.singleChoiceResp)
  const [ currentResponse, setCurrentResponse ] = useState(question.singleChoiceResp || null)
  const [ respondToQuestion, { loading } ] = useMutation(SUBMIT_CHOICE_RESPONSE)

  const onChange = (b: unknown) => {
    setCurrentResponse(b as string)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    respondToQuestion({ variables: { questionId: question.id, value: currentResponse }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
      <Form.Label>{question.text}</Form.Label>
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}>
        <ToggleButtonGroup name='Single choice button group' type='radio' value={currentResponse} onChange={onChange}>
          {
            question.options.map(option => <ToggleButton key={option.value} value={option.value}>{option.text}</ToggleButton>)
          }
        </ToggleButtonGroup>
      </ButtonRow>
    </div>
  )
}

type MultipleChoiceQuestionProps = {
  question: Q.MultipleChoiceQuestion
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.multipleChoiceResp?.length)
  const [ currentResponses, setCurrentResponse ] = useState(question.multipleChoiceResp || [])
  const [ respondToQuestion, { loading } ] = useMutation(SUBMIT_CHOICE_RESPONSES)

  const onChange = (resp: string[]) => {
    setCurrentResponse(resp)
    setHasChangedSinceLastSave(true)
  }

  const onSave = () => {
    respondToQuestion({ variables: { questionId: question.id, values: currentResponses }})
    setHasChangedSinceLastSave(false)
  }

  return (
    <div>
      <Form.Label>{question.text}</Form.Label>
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}>
        <ToggleButtonGroup type='checkbox' value={currentResponses} onChange={onChange}>
          {
            question.options.map(option => <ToggleButton key={option.value} value={option.value}>{option.text}</ToggleButton>)
          }
        </ToggleButtonGroup>
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

const ButtonRow: React.FC<{ loading: boolean, hasChangedSinceLastSave: boolean, onSave: () => void}> = ({ loading, hasChangedSinceLastSave, onSave, children }) => {
  const buttonValue = loading
    ? <Spinner animation='grow' size={'sm'}/>
    : hasChangedSinceLastSave
      ? 'Save'
      : <FontAwesomeIcon icon={icons.faCheck} className='icon' size='lg'/>


  const buttonVariant = loading
    ? 'secondary'
    : hasChangedSinceLastSave
      ? 'primary'
      : 'success'

  const justify = !!children
    ? 'justify-content-between'
    : 'justify-content-end'

  return (
    <Row className={'d-flex mr-3 ' + justify} >
      { children }
      <Button variant={buttonVariant} onClick={onSave}>{buttonValue}</Button>
    </Row>
  )
}

