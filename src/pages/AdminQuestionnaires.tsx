import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { UPDATE_QUESTION, GET_ALL_QUESTIONNAIRES, CREATE_QUESTIONNAIRE, DELETE_QUESTIONNAIRE, ADD_QUESTIONS, DELETE_QUESTION, CREATE_QUESTION_RELATIONS } from 'util/queries'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import ErrorPage from 'pages/Error'
import Loading from 'pages/Loading'
import FormInput from 'components/FormInput'
import QuestionModal from 'components/QuestionModal'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import { TQuestionnaire } from 'types/Questionnaire.d'
import { Question } from 'types/Question.d'
import Questionnaire from 'components/Questionnaire'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons' // TODO narrow

const AdminQuestionnairesPage = () => {

  const { data, loading, error } = useQuery(GET_ALL_QUESTIONNAIRES)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>
  if (!data?.questionnaires?.length) return <Wrapper><h2>No questionnaires!</h2></Wrapper>

  return (
    <Wrapper>
      { data.questionnaires.map((q: TQuestionnaire) => <QuestionnaireWrapper questionnaire={q} key={q.id}/>) }
    </Wrapper>
  )
}

const Wrapper: React.FC = ({ children }) => {
  const [ isQuestionnaireModalOpen, setIsQuestionnaireModalOpen ] = useState(false)
  const [ questionnaireTitle, setQuestionnaireTitle ] = useState('')

  const [ createQuestionnaire ] = useMutation(CREATE_QUESTIONNAIRE, {
    refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]
  })

  const onCreateClick = () => {
    createQuestionnaire({ variables: { title: questionnaireTitle, questions: [] }})
    setIsQuestionnaireModalOpen(false)
    setQuestionnaireTitle('')
  }

  return (
    <Container>
      <h1>Questionnaires</h1>
      <Button onClick={() => setIsQuestionnaireModalOpen(true)}>Add Questionnaire</Button>
      <hr/>
      { children }

      <Modal show={isQuestionnaireModalOpen} centered onHide={() => setIsQuestionnaireModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Add Questionnaire</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormInput
            autoFocus={true}
            label={'Questionnaire Title'}
            value={questionnaireTitle}
            type="text"
            onChange={setQuestionnaireTitle}/>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsQuestionnaireModalOpen(false)}>close</Button>
          <Button variant="primary" onClick={onCreateClick}>save</Button>
        </Modal.Footer>

      </Modal>
    </Container>
  )
}

const QuestionnaireWrapper: React.FC<{ questionnaire: TQuestionnaire }> = ({ questionnaire }) => {
  const [ isQuestionModalOpen, setIsQuestionModalOpen ] = useState(false)
  const [ isRelationModalOpen, setIsRelationModalOpen ] = useState(false)
  const [ relationFromId, setRelationFromId ]           = useState(0)
  const [ relationToId, setRelationToId ]               = useState(0)
  const [ relationIncludes, setRelationIncludes ]       = useState('')
  const [ relationEquals, setRelationEquals ]           = useState('')

  const options = { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]}

  const [ deleteQuestionnaire ] = useMutation(DELETE_QUESTIONNAIRE, options)
  const [ addQuestion ]         = useMutation(ADD_QUESTIONS, options)
  const [ updateQuestion ]      = useMutation(UPDATE_QUESTION, options)
  const [ addRelation ]         = useMutation(CREATE_QUESTION_RELATIONS, options)
  const [ deleteQuestion ]      = useMutation(DELETE_QUESTION, options)

  const onDeleteQuestionnaire = () => {
    deleteQuestionnaire({ variables: { id: questionnaire.id }})
  }

  const onDeleteQuestion = (question: Question) => () => {
    deleteQuestion({ variables: { id: question.id }})
  }

  const onCreateQuestionClick = (question: Question) => {
    addQuestion({ variables: { questions: [
      { questionnaireId: questionnaire.id, ...question }
    ]}})
    setIsQuestionModalOpen(false)
  }

  const onUpdateQuestion = (question: Question) => {
    updateQuestion({ variables: { question }})
  }

  const onCreateRelationClick = () => {
    addRelation({ variables: { relations: [{
      questionId: relationFromId,
      nextQuestionId: relationToId,
      includes: relationIncludes,
      equals: relationEquals
    }]}})

    setRelationFromId(0)
    setRelationToId(0)
    setRelationIncludes('')
    setRelationEquals('')
    setIsRelationModalOpen(false)
  }

  const questionIdOptions = questionnaire.questions.map(q => ({ value: q.id, label: q.text }))

  const withoutPropagation = (fn: Function) => (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fn()
  }

  const QuestionnaireTitleAdditions = () => (
    <React.Fragment>
      <Button className='mr-1' variant='success' onClick={withoutPropagation(() => {})}>Update Title</Button>
      <Button className='mr-1' onClick={withoutPropagation(() => setIsQuestionModalOpen(true))}>Add Question</Button>
      <Button className='mr-1' onClick={withoutPropagation(() => setIsRelationModalOpen(true))}>Add Question Relation</Button>
      <Button className='mr-1' variant='danger' onClick={withoutPropagation(onDeleteQuestionnaire)}>
          <FontAwesomeIcon icon={faTimes} className='icon' size='sm'/>
      </Button>
    </React.Fragment>
  )

  const QuestionTitleAdditions: React.FC<{ question: Question }> = ({ question }) => {
    const [ isUpdateModalOpen, setIsUpdateModalOpen ] = useState(false)

    return (
      <Row>
        <p className='mr-1'>({question.id})</p>
        <p className='mr-1'>({question.type})</p>
        <Button className='mr-1' variant='success' onClick={() => setIsUpdateModalOpen(true)}>Update</Button>
        <Button className='mr-1' variant='danger' size='sm' onClick={onDeleteQuestion(question)}>
          <FontAwesomeIcon icon={faTimes} className='icon' size='sm'/>
        </Button>
        <QuestionModal
          show={isUpdateModalOpen}
          close={() => setIsUpdateModalOpen(false)}
          save={onUpdateQuestion}
          question={question}
        />
      </Row>
    )
  }

  return (
    <React.Fragment>
      <Questionnaire
        questionnaire={questionnaire}
        isAnswerable={false}
        QuestionnaireButtons={QuestionnaireTitleAdditions}
        QuestionButtons={QuestionTitleAdditions}
      />

      <QuestionModal
        show={isQuestionModalOpen}
        close={() => setIsQuestionModalOpen(false)}
        save={(question: Question) => onCreateQuestionClick(question)}
      />

      <Modal show={isRelationModalOpen} centered onHide={() => setIsRelationModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>

          <Modal.Body>
            <Form.Label>From</Form.Label>
            <Select
              className='pb-3'
              onChange={onSelectChange(setRelationFromId)}
              options={questionIdOptions}/>
            <Form.Label>To</Form.Label>

            <Select
              className='pb-3'
              onChange={onSelectChange(setRelationToId)}
              options={questionIdOptions}/>

            <FormInput
              autoFocus={true}
              label={'includes'}
              value={relationIncludes}
              type="text"
              onChange={setRelationIncludes}/>

            <FormInput
              autoFocus={false}
              label={'equals'}
              value={relationEquals}
              type="text"
              onChange={setRelationEquals}/>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsRelationModalOpen(false)}>close</Button>
            <Button variant="primary" onClick={onCreateRelationClick}>save</Button>
          </Modal.Footer>
        </Modal>
    </React.Fragment>
  )
}

export default AdminQuestionnairesPage
