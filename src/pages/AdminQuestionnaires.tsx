import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { UPDATE_QUESTION, GET_ALL_QUESTIONNAIRES, CREATE_QUESTIONNAIRE, DELETE_QUESTIONNAIRE, ADD_QUESTIONS, DELETE_QUESTION, CREATE_QUESTION_RELATIONS } from 'util/queries'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import FormInput from 'components/FormInput'
import QuestionModal from 'components/QuestionModal'
import Select from 'react-select'
import onSelectChange, { TOption } from 'util/onSelectChange'
import { TQuestionnaire } from 'types/Questionnaire.d'
import { TQuestion, TQuestionOption } from 'types/Question.d'

const AdminQuestionnairesPage = () => {

  const { data, loading, error } = useQuery(GET_ALL_QUESTIONNAIRES)

  if (loading) return <Wrapper><Spinner animation='grow'/></Wrapper>
  if (error) return <Wrapper><code>{JSON.stringify(error, null, 2)}</code></Wrapper>
  if (!data?.questionnaires?.length) return <Wrapper><h2>No questionnaires!</h2></Wrapper>

  return (
    <Wrapper>
      { data.questionnaires.map((q: TQuestionnaire) => <Questionnaire questionnaire={q} key={q.id}/>) }
    </Wrapper>
  )

}

const Wrapper: React.FC = ({ children }) => {
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ newQuestionnaireTitle, setNewQuestionnaireTitle ] = useState('')

  const [ createQuestionnaire ] = useMutation(CREATE_QUESTIONNAIRE, {
    refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]
  })

  const onCreateClick = () => {
    createQuestionnaire({ variables: { title: newQuestionnaireTitle, questions: [] }})
    setIsModalOpen(false)
    setNewQuestionnaireTitle('')
  }

  return (
    <Container>
      <h1>Questionnaires</h1>
      <Button onClick={() => setIsModalOpen(true)}>Add Questionnaire</Button>
      <hr/>
      { children }

      <Modal show={isModalOpen} centered onHide={() => setIsModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Add Questionnaire</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormInput
            autoFocus={true}
            label={'Questionnaire Title'}
            value={newQuestionnaireTitle}
            type="text"
            onChange={setNewQuestionnaireTitle}/>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>close</Button>
          <Button variant="primary" onClick={onCreateClick}>save</Button>
        </Modal.Footer>

      </Modal>
    </Container>
  )
}

const Question: React.FC<{ question: TQuestion, saveQuestion: (question: TQuestion) => void }> = ({ question, saveQuestion }) => {
  const [ deleteQuestion ] = useMutation(DELETE_QUESTION, { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]})
  const [ updateQuestion ] = useMutation(UPDATE_QUESTION, { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]})
  const [ isUpdateModalOpen, setIsUpdateModalOpen ] = useState(false)

  const onXClick = () => {
    deleteQuestion({ variables: { id: question.id }})
  }

  const onUpdateClick = () => {
    setIsUpdateModalOpen(true)
  }

  const onSaveQuestion = (question: TQuestion) => {
    setIsUpdateModalOpen(false)
    saveQuestion(question)
  }

  return (
    <div>
      <Row>
        <small>{question.id}</small>
        <h3 onClick={onUpdateClick}>{question.text}</h3>
        <small>({question.type})</small>
        <code onClick={onXClick}>x</code>
      </Row>
      <p>Options: {JSON.stringify(question.options, null, 2)}</p>
      <p>Next: {JSON.stringify(question.next, null, 2)}</p>

      <QuestionModal
        show={isUpdateModalOpen}
        close={() => setIsUpdateModalOpen(false)}
        save={onSaveQuestion}
        question={question}
      />
    </div>
  )
}

const Questionnaire: React.FC<{ questionnaire: TQuestionnaire }> = ({ questionnaire }) => {
  const [ isQuestionModalOpen, setIsQuestionModalOpen ] = useState(false)
  const [ isRelationModalOpen, setIsRelationModalOpen ] = useState(false)
  const [ relationFromId, setRelationFromId ] = useState(0)
  const [ relationToId, setRelationToId ] = useState(0)
  const [ relationIncludes, setRelationIncludes ] = useState('')
  const [ relationEquals, setRelationEquals ] = useState('')

  const [ deleteQuestionnaire ] = useMutation(DELETE_QUESTIONNAIRE, { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]})
  const [ addQuestion ] = useMutation(ADD_QUESTIONS, { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]})
  const [ updateQuestion ] = useMutation(UPDATE_QUESTION, { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]})
  const [ addRelation ] = useMutation(CREATE_QUESTION_RELATIONS, { refetchQueries: [{ query: GET_ALL_QUESTIONNAIRES }]})

  const onDelete = (id: number) => () => {
    deleteQuestionnaire({ variables: { id }})
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

  const questionIdOptions = questionnaire.questions.map(q => ({ value: q.id, label: q.text }))

  return (
    <div>
      <Row>
        <code style={{ cursor: 'pointer' }} onClick={onDelete(questionnaire.id)}>X</code>
        <h2>{questionnaire.title}</h2>
        <h2 onClick={() => setIsQuestionModalOpen(true)}>(Add Question)</h2>
        <h2 onClick={() => setIsRelationModalOpen(true)}>(Add Question Relation)</h2>
      </Row>
      {questionnaire.questions.map((q: TQuestion) => <Question saveQuestion={onUpdateQuestion} question={q} key={q.id}/> )}
      <br/>

      <QuestionModal
        show={isQuestionModalOpen}
        close={() => setIsQuestionModalOpen(false)}
        save={(question: TQuestion) => onCreateQuestionClick(question)}
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
    </div>

  )
}

export default AdminQuestionnairesPage
