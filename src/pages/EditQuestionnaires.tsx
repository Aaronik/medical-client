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
import Spinner from 'react-bootstrap/Spinner'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import onKeyDown from 'util/onKeyDown'
import withoutPropagation from 'util/withoutPropagation'
import withoutResponses from 'util/withoutResponses'
import { TQuestion } from 'types/Question.d'
import { TQuestionnaire } from 'types/Questionnaire.d'
import { UPDATE_QUESTIONNAIRE, ADD_QUESTIONS, CREATE_QUESTIONNAIRE, CREATE_QUESTION_RELATIONS, DELETE_QUESTION, DELETE_QUESTIONNAIRE, UPDATE_QUESTION } from 'util/queries'
import omitDeep from 'omit-deep-lodash'

type Props = {
  questionnairesQuery: DocumentNode
}

const EditQuestionnairesPage: React.FC<Props> = ({ questionnairesQuery }) => {

  const { data, loading, error } = useQuery(questionnairesQuery)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>

  let questionnaires = Object.values(data)?.[0] as TQuestionnaire[]
  // It'd be great if useQuery could do this automatically, but I'm not sure how to make that happen
  // See: https://github.com/apollographql/apollo-feature-requests/issues/6
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

  const [ createQuestionnaire, { loading: createQuestionnaireLoading, error: createQuestionnaireError }] = useMutation(CREATE_QUESTIONNAIRE, {
    refetchQueries: [{ query: questionnairesQuery }]
  })

  if (createQuestionnaireError) return <ErrorPage error={createQuestionnaireError}/>

  const onCreateClick = () => {
    createQuestionnaire({ variables: { title: questionnaireTitle, questions: [] }})
    setIsQuestionnaireModalOpen(false)
    setQuestionnaireTitle('')
  }

  return (
    <Container>
      <h1>Questionnaires { createQuestionnaireLoading && <Spinner animation='grow'/>}</h1>
      <Button onClick={() => setIsQuestionnaireModalOpen(true)}>Create Questionnaire</Button>
      <hr/>
      { children }

      <AddQuestionnaireModal
        show={isQuestionnaireModalOpen}
        close={() => setIsQuestionnaireModalOpen(false)}
        onSave={onCreateClick}
        onTitleChange={setQuestionnaireTitle}
        title={questionnaireTitle} />

    </Container>
  )
}

type AddQuestionnaireModalProps = {
  show: boolean
  close: () => void
  title: string
  onTitleChange: (title: string) => void
  onSave: () => void
}

const AddQuestionnaireModal: React.FC<AddQuestionnaireModalProps> = ({ show, close, onSave, onTitleChange, title }) => {
  return (
    <Modal show={show} centered onHide={close}>
      <Modal.Header>
        <Modal.Title>Create Questionnaire</Modal.Title>
      </Modal.Header>

      <Modal.Body onKeyDown={onKeyDown('Enter', onSave)}>
        <FormInput
          autoFocus={true}
          label={'Questionnaire Title'}
          value={title}
          type="text"
          onChange={onTitleChange}/>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>close</Button>
        <Button variant="primary" onClick={onSave}>save</Button>
      </Modal.Footer>
    </Modal>
  )
}

const EditableQuestionnaire: React.FC<{ questionnaire: TQuestionnaire, questionnairesQuery: DocumentNode }> = ({ questionnaire, questionnairesQuery }) => {
  // The apollo cache can get confused sometimes :/ Make sure no responses are passed in,
  // edit questionnaires should hopefully never need to have any responses.
  questionnaire = withoutResponses(questionnaire)

  const [ isQuestionModalOpen, setIsQuestionModalOpen ]                   = useState(false)
  const [ isRelationModalOpen, setIsRelationModalOpen ]                   = useState(false)
  const [ isEditQuestionnaireModalOpen, setIsEditQuestionnaireModalOpen ] = useState(false)
  const [ questionnaireTitle, setQuestionnaireTitle ]                     = useState(questionnaire.title)
  const [ relationFromId, setRelationFromId ]                             = useState(0)
  const [ relationToId, setRelationToId ]                                 = useState(0)
  const [ relationIncludes, setRelationIncludes ]                         = useState('')
  const [ relationEquals, setRelationEquals ]                             = useState('')

  const options = { refetchQueries: [{ query: questionnairesQuery }], onError: console.error }

  const [ addQuestion, { error: addError } ]                         = useMutation(ADD_QUESTIONS, options)
  const [ updateQuestion, { error: updateError } ]                   = useMutation(UPDATE_QUESTION, options)
  const [ addRelation, { error: addRelationError } ]                 = useMutation(CREATE_QUESTION_RELATIONS, options)
  const [ deleteQuestion, { error: deleteError } ]                   = useMutation(DELETE_QUESTION, options)
  const [ deleteQuestionnaire, { error: deleteQuestionnaireError, loading: deleteQuestionnaireLoading }] = useMutation(DELETE_QUESTIONNAIRE, options)
  const [ updateQuestionnaire, { error: updateQuestionnaireError, loading: updateQuestionnaireLoading }] = useMutation(UPDATE_QUESTIONNAIRE, options)

  for (let error of [ addError, updateError, addRelationError, deleteError, deleteQuestionnaireError, updateQuestionnaireError ]) {
    if (error) return <ErrorPage error={error}/>
  }

  const onUpdateQuestionnaire = () => {
    updateQuestionnaire({ variables: { id: questionnaire.id, title: questionnaireTitle }})
    setIsEditQuestionnaireModalOpen(false)
  }

  const onDeleteQuestionnaire = () => {
    deleteQuestionnaire({ variables: { id: questionnaire.id }})
  }

  const onDeleteQuestion = (question: TQuestion) => () => {
    deleteQuestion({ variables: { id: question.id }})
  }

  const onCreateQuestionClick = (question: TQuestion) => {
    addQuestion({ variables: { questions: [
      { questionnaireId: questionnaire.id, ...question }
    ]}})
    setIsQuestionModalOpen(false)
  }

  const onUpdateQuestion = (question: TQuestion) => {
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

  // We're guaranteed to have a question from the db (so it'll have an id) b/c we're adding relations to already
  // existing questions. The questions have to have been saved to get here.
  const questionIdOptions = questionnaire.questions.map(q => ({ value: q.id as number, label: q.text }))

  const QuestionnaireTitleAdditions = () => (
    <React.Fragment>
      <Button className='mr-1' variant='success' onClick={withoutPropagation(() => setIsEditQuestionnaireModalOpen(true))}>Update Title</Button>
      <Button className='mr-1' onClick={withoutPropagation(() => setIsQuestionModalOpen(true))}>Add Question</Button>
      <Button className='mr-1' onClick={withoutPropagation(() => setIsRelationModalOpen(true))}>Add Question Relation</Button>
      <Button className='mr-1' variant='danger' onClick={withoutPropagation(onDeleteQuestionnaire)}>
        { deleteQuestionnaireLoading ? <Spinner animation='grow' size='sm'/> : <FontAwesomeIcon icon={faTimes} className='icon' size='sm'/> }
      </Button>
      { updateQuestionnaireLoading && <Spinner animation='grow' size='sm'/> }
    </React.Fragment>
  )

  const QuestionTitleAdditions: React.FC<{ question: TQuestion }> = ({ question }) => {
    const [ isUpdateModalOpen, setIsUpdateModalOpen ] = useState(false)

    return (
      <Row>
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
        save={(question: TQuestion) => onCreateQuestionClick(question)}
      />

      <AddQuestionnaireModal
        show={isEditQuestionnaireModalOpen}
        close={() => setIsEditQuestionnaireModalOpen(false)}
        title={questionnaireTitle}
        onTitleChange={setQuestionnaireTitle}
        onSave={onUpdateQuestionnaire}
      />

      <Modal show={isRelationModalOpen} centered onHide={() => setIsRelationModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>

          <Modal.Body onKeyDown={onKeyDown('Enter', onCreateRelationClick)}>
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
