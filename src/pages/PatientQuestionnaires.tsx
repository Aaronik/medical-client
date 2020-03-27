import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Loading from 'pages/Loading'
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
  if (error) return <code>{JSON.stringify(error, null, 2)}</code>

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

  const containerStyle = {
    border: '1px solid black',
    margin: '2px',
    padding: '5px',
    cursor: 'pointer',
  }

  if (!isExpanded) return (
    <div style={containerStyle} onClick={() => setIsExpanded(true)}>
      <h2>{questionnaire.title}</h2>
    </div>
  )

  return (
    <div style={containerStyle}>
      <h2 onClick={() => setIsExpanded(false)}>{questionnaire.title}</h2>
      { questionnaire.questions.map((q: Q.Question) => {
        const Component = questionTypeMap(q.type)
        return <Component question={q} key={q.id}/>
      })}
    </div>
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
      <ToggleButtonGroup name='what' type='radio' value={currentResponse} onChange={onChange}>
        <ToggleButton value={true}>Yes</ToggleButton>
        <ToggleButton value={false}>No</ToggleButton>
      </ToggleButtonGroup>
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}/>
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
      <ToggleButtonGroup name='Single choice button group' type='radio' value={currentResponse} onChange={onChange}>
        {
          question.options.map(option => <ToggleButton key={option.value} value={option.value}>{option.text}</ToggleButton>)
        }
      </ToggleButtonGroup>
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}/>
    </div>
  )
}

type MultipleChoiceQuestionProps = {
  question: Q.MultipleChoiceQuestion
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question }) => {
  const [ hasChangedSinceLastSave, setHasChangedSinceLastSave ] = useState(!question.multipleChoiceResp)
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
      <ToggleButtonGroup type='checkbox' value={currentResponses} onChange={onChange}>
        {
          question.options.map(option => <ToggleButton key={option.value} value={option.value}>{option.text}</ToggleButton>)
        }
      </ToggleButtonGroup>
      <ButtonRow loading={loading} hasChangedSinceLastSave={hasChangedSinceLastSave} onSave={onSave}/>
    </div>
  )
}

const questionTypeMap = (type: Q.QuestionType): React.FC<any> => ({
  TEXT: TextQuestion,
  BOOLEAN: BoolQuestion,
  SINGLE_CHOICE: SingleChoiceQuestion,
  MULTIPLE_CHOICE: MultipleChoiceQuestion
}[type])

const ButtonRow: React.FC<{ loading: boolean, hasChangedSinceLastSave: boolean, onSave: () => void}> = ({ loading, hasChangedSinceLastSave, onSave }) => {
  const buttonValue = loading
    ? <Spinner animation='grow'/>
    : hasChangedSinceLastSave
      ? 'Save'
      : <FontAwesomeIcon icon={icons.faCheck} className='icon' size='lg'/>


  const buttonVariant = loading
    ? 'secondary'
    : hasChangedSinceLastSave
      ? 'primary'
      : 'success'

  return (
    <Row className='d-flex justify-content-end mr-3'>
      <Button variant={buttonVariant} onClick={onSave}>{buttonValue}</Button>
    </Row>
  )
}

