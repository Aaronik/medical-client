import { DocumentNode, useMutation, useQuery } from '@apollo/client'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormInput from 'components/FormInput'
import QuestionModal from 'components/QuestionModal'
import Questionnaire from 'components/Questionnaire'
import ErrorPage from 'pages/Error'
import Loading from 'pages/Loading'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import { Question } from 'types/Question.d'
import { TQuestionnaire } from 'types/Questionnaire.d'
import { ADD_QUESTIONS, CREATE_QUESTIONNAIRE, CREATE_QUESTION_RELATIONS, DELETE_QUESTION, DELETE_QUESTIONNAIRE, UPDATE_QUESTION } from 'util/queries'
import omitDeep from 'omit-deep-lodash'

type Props = {
  questionnairesQuery: DocumentNode
}

const EditQuestionnairesPage: React.FC<Props> = ({ questionnairesQuery }) => {

  const { data, loading, error } = useQuery(questionnairesQuery)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>

  let questionnaires = Object.values(data)?.[0] as TQuestionnaire[]

  // TODO This supremely does not belong here, but I'm having a heck of a hard time finding a way to get
  // it closer to GQL.
  //  * Looks like apollo is dropping the ball again: https://github.com/apollographql/apollo-feature-requests/issues/6
  //  * Could have custom useQuery and useMutation's? That'd also let me bake in onError: console.error to useMutation options
  questionnaires = omitDeep(questionnaires, '__typename')

  if (!questionnaires?.length) return <Wrapper questionnairesQuery={questionnairesQuery}><h2>No questionnaires!</h2></Wrapper>

  return (
    <Wrapper questionnairesQuery={questionnairesQuery}>
      { questionnaires.map((q: TQuestionnaire) => <EditableQuestionnaire questionnairesQuery={questionnairesQuery} questionnaire={q} key={q.id}/>) }
    </Wrapper>
  )
}

const Wrapper: React.FC<Props> = ({ children, questionnairesQuery }) => {
  const [ isQuestionnaireModalOpen, setIsQuestionnaireModalOpen ] = useState(false)
  const [ questionnaireTitle, setQuestionnaireTitle ] = useState('')

  const [ createQuestionnaire ] = useMutation(CREATE_QUESTIONNAIRE, {
    refetchQueries: [{ query: questionnairesQuery }]
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

const EditableQuestionnaire: React.FC<{ questionnaire: TQuestionnaire, questionnairesQuery: DocumentNode }> = ({ questionnaire, questionnairesQuery }) => {
  const [ isQuestionModalOpen, setIsQuestionModalOpen ] = useState(false)
  const [ isRelationModalOpen, setIsRelationModalOpen ] = useState(false)
  const [ relationFromId, setRelationFromId ]           = useState(0)
  const [ relationToId, setRelationToId ]               = useState(0)
  const [ relationIncludes, setRelationIncludes ]       = useState('')
  const [ relationEquals, setRelationEquals ]           = useState('')

  const options = { refetchQueries: [{ query: questionnairesQuery }], onError: console.error }

  const [ addQuestion, { error: addError } ]                         = useMutation(ADD_QUESTIONS, options)
  const [ updateQuestion, { error: updateError } ]                   = useMutation(UPDATE_QUESTION, options)
  const [ addRelation, { error: addRelationError } ]                 = useMutation(CREATE_QUESTION_RELATIONS, options)
  const [ deleteQuestion, { error: deleteError } ]                   = useMutation(DELETE_QUESTION, options)
  const [ deleteQuestionnaire, { error: deleteQuestionnaireError } ] = useMutation(DELETE_QUESTIONNAIRE, options)

  for (let error of [ addError, updateError, addRelationError, deleteError, deleteQuestionnaireError ]) {
    if (error) return <ErrorPage error={error}/>
  }

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

export default EditQuestionnairesPage
