import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import ErrorPage from 'pages/Error'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Questionnaire from 'components/Questionnaire'
import { GET_QUESTIONNAIRES_I_MADE, GET_QUESTIONNAIRES_FOR_MY_PATIENT } from 'util/queries'
import { TUser } from 'types/User'
import { QuestionnaireAssignment } from 'types/QuestionnaireAssignment'
import { TQuestionnaire } from 'types/Questionnaire'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import { getQuestionnaireCompletionStatusIcon } from 'util/getQuestionnaireCompletionStatus'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'uuid/v4'

type TProps = {
  patient: TUser
}

const DoctorAssignmentsPage: React.FC<TProps> = ({ patient }) => {

  const { data: assData, loading: assLoading, error: assError }
    = useQuery<{ questionnaireAssignmentsIMade: QuestionnaireAssignment[]}>(QUESTIONNAIRE_ASSIGNMENTS_I_MADE)

  const { data: qiData, loading: qiLoading, error: qiError }
    = useQuery<{ questionnairesIMade: TQuestionnaire[] }>(GET_QUESTIONNAIRES_I_MADE)

  const { data: qpData, loading: qpLoading, error: qpError }
    = useQuery<{ questionnairesForMyPatient: TQuestionnaire[] }>(GET_QUESTIONNAIRES_FOR_MY_PATIENT, { variables: { patientId: patient.id }})

  const [ assignQuestionnaire, { loading: createAssignmentLoading, error: createError }] = useMutation(CREATE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [
      { query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE },
      { query: GET_QUESTIONNAIRES_FOR_MY_PATIENT, variables: { patientId: patient.id }},
    ]
  })

  const [ deleteAssignment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [
      { query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE },
      { query: GET_QUESTIONNAIRES_FOR_MY_PATIENT, variables: { patientId: patient.id }},
    ]
  })

  if (assError) return <ErrorPage error={assError}/>
  if (qiError) return <ErrorPage error={qiError}/>
  if (qpError) return <ErrorPage error={qpError}/>
  if (createError) return <ErrorPage error={createError}/>
  if (deleteError) return <ErrorPage error={deleteError}/>

  const onAssign = (questionnaireId: number) => {
    assignQuestionnaire({ variables: { questionnaireId, assigneeId: patient.id }})
  }

  const onDelete = (questionnaireId: number) => {
    deleteAssignment({ variables: { questionnaireId, assigneeId: patient.id }})
  }

  const assignments = assData?.questionnaireAssignmentsIMade?.filter(a => a.assignee?.id === patient.id) || []
  const questionnairesIMade = qiData?.questionnairesIMade || []
  const myPatientsQuestionnaires = qpData?.questionnairesForMyPatient

  const questionnaires = assignments.map(assignment => {
    const patientsQuestionnaire = myPatientsQuestionnaires?.find(q => q.id === assignment.questionnaire?.id)

    // This'll happen after the user has created an assignment and before the refetch query has executed
    if (!patientsQuestionnaire) return <div key={uuid()}></div>

    const completionIcon = getQuestionnaireCompletionStatusIcon(patientsQuestionnaire)

    return (
      <Row className='d-flex flex-row justify-content-between align-items-center' key={patientsQuestionnaire.id}>
        <Questionnaire
          questionnaire={patientsQuestionnaire}
          isAnswerable={false}
          className='flex-grow-1 mr-4'
        />
        {completionIcon}
        <FontAwesomeIcon icon={icons.faTimes} size='lg' className='text-danger clickable ml-3' onClick={() => onDelete(patientsQuestionnaire.id)}/>
      </Row>
    )
  })

  const dropdownOptions = questionnairesIMade.map(q => ({ label: q.title, value: q.id }))

  return (
    <Container className='mt-5'>
      <h3 className='mb-4'>
        Questionnaires Assigned to {patient.name}
        {(assLoading || qiLoading || qpLoading || deleteLoading || createAssignmentLoading) && <Spinner animation='grow'/>}
      </h3>

      <Select
        options={dropdownOptions}
        onChange={onSelectChange(onAssign)}
        placeholder={'Assign a questionnaire...'} />

      <h3 className='my-4'>Responses</h3>
      {questionnaires}

    </Container>
  )
}

export default DoctorAssignmentsPage

const QUESTIONNAIRE_ASSIGNMENTS_I_MADE = gql`
  query {
    questionnaireAssignmentsIMade {
      assignee {
        id
        name
      }
      questionnaire {
        id
        title
      }
    }
  }
`

const CREATE_QUESTIONNAIRE_ASSIGNMENT = gql`
  mutation CreateQuestionnaireAssignment($questionnaireId: Int!, $assigneeId: Int!) {
    createQuestionnaireAssignment(questionnaireId: $questionnaireId, assigneeId: $assigneeId)
  }
`

const DELETE_QUESTIONNAIRE_ASSIGNMENT = gql`
  mutation DeleteQuestionnaireAssignment($questionnaireId: Int!, $assigneeId: Int!) {
    deleteQuestionnaireAssignment(questionnaireId: $questionnaireId, assigneeId: $assigneeId)
  }
`

