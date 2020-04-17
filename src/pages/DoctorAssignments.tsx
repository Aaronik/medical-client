import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import ErrorPage from 'pages/Error'
import LoadingPage from 'pages/Loading'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Questionnaire from 'components/Questionnaire'
import { GET_QUESTIONNAIRES_I_MADE, GET_QUESTIONNAIRES_FOR_MY_PATIENT } from 'util/queries'
import { TUser } from 'types/User'
import { QuestionnaireAssignment } from 'types/QuestionnaireAssignment'
import { TQuestionnaire } from 'types/Questionnaire'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'

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

  const [ assignQuestionnaire, { loading: createAssignmentLoading, error: createAssignmentError }] = useMutation(CREATE_QUESTIONNAIRE_ASSIGNMENT, {
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

  if (assLoading || qiLoading || qpLoading) return <LoadingPage/>
  if (assError) return <ErrorPage error={assError}/>
  if (qiError) return <ErrorPage error={qiError}/>
  if (qpError) return <ErrorPage error={qpError}/>

  const onAssign = (questionnaireId: number) => {
    assignQuestionnaire({ variables: { questionnaireId, assigneeId: patient.id }})
  }

  const onDelete = (questionnaireId: number) => {
    deleteAssignment({ variables: { questionnaireId, assigneeId: patient.id }})
  }

  const assignments = assData?.questionnaireAssignmentsIMade?.filter(a => a.assignee?.id === patient.id) || []
  const questionnairesIMade = qiData?.questionnairesIMade || []
  const myPatientsQuestionnaires = qpData?.questionnairesForMyPatient

  const rows = assignments.map(assignment => {
    const questionnaire = assignment.questionnaire as TQuestionnaire
    return (
      <tr key={questionnaire.id}>
        <td>{questionnaire.title}</td>
        <td><span className='text-danger clickable ml-2' onClick={() => onDelete(questionnaire.id)}>X</span></td>
      </tr>
    )
  })

  const questionnaires = assignments.map(assignment => {
    const patientsQuestionnaire = myPatientsQuestionnaires?.find(q => q.id === assignment.questionnaire?.id)

    // This'll happen after the user has created an assignment and before the refetch query has executed
    if (!patientsQuestionnaire) return <div></div>

    return (
      <Questionnaire
        key={patientsQuestionnaire.id}
        questionnaire={patientsQuestionnaire}
        isAnswerable={false}
      />
    )
  })

  const dropdownOptions = questionnairesIMade.map(q => ({ label: q.title, value: q.id }))

  return (
    <Container className='mt-5'>
      <section className='mb-5'>
        <h3>Questionnaires Assigned to {patient.name}</h3>

        <Table>
          <tbody>
            { rows }
          </tbody>
        </Table>

        <Select
          options={dropdownOptions}
          onChange={onSelectChange(onAssign)}
          placeholder={'Assign a questionnaire...'}
          />
      </section>

      <section>
        <h3>Responses</h3>
        {questionnaires}
      </section>

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
