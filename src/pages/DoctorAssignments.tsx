import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import ErrorPage from 'pages/Error'
import LoadingPage from 'pages/Loading'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import { GET_QUESTIONNAIRES_I_MADE } from 'util/queries'
import { TUser } from 'types/User'
import { QuestionnaireAssignment } from 'types/QuestionnaireAssignment'
import { TQuestionnaire } from 'types/Questionnaire'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'

type TProps = {
  patient: TUser
}

const DoctorAssignmentsPage: React.FC<TProps> = ({ patient }) => {
  const { data: assData, loading: assLoading, error: assError } = useQuery<{ questionnaireAssignmentsIMade: QuestionnaireAssignment[]}>(QUESTIONNAIRE_ASSIGNMENTS_I_MADE)
  const { data: qData, loading: qLoading, error: qError } = useQuery<{ questionnairesIMade: TQuestionnaire[] }>(GET_QUESTIONNAIRES_I_MADE)

  const [ assignQuestionnaire, { loading: createAssignmentLoading, error: createAssignmentError }] = useMutation(CREATE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [{ query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE }]
  })

  const [ deleteAssignment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_QUESTIONNAIRE_ASSIGNMENT, {
    onError: console.error,
    refetchQueries: [{ query: QUESTIONNAIRE_ASSIGNMENTS_I_MADE }]
  })

  if (assLoading || qLoading) return <LoadingPage/>
  if (assError) return <ErrorPage error={assError}/>
  if (qError) return <ErrorPage error={qError}/>

  const onAssign = (questionnaireId: number) => {
    assignQuestionnaire({ variables: { questionnaireId, assigneeId: patient.id }})
  }

  const onDelete = (questionnaireId: number) => {
    console.log('onDelete, questionnaireId:', questionnaireId)
    deleteAssignment({ variables: { questionnaireId, assigneeId: patient.id }})
  }

  const assignments = assData?.questionnaireAssignmentsIMade?.filter(a => a.assignee?.id === patient.id) || []
  const questionnaires = qData?.questionnairesIMade || []

  const rows = assignments.map(assignment => {
    const questionnaire = assignment.questionnaire as TQuestionnaire
    return (
      <tr key={questionnaire.id}>
        <td>{questionnaire.title}</td>
        <td><span className='text-danger clickable ml-2' onClick={() => onDelete(questionnaire.id)}>X</span></td>
      </tr>
    )
  })

  const options = questionnaires.map(q => ({ label: q.title, value: q.id }))

  return (
    <Container>
      <Select
        options={options}
        onChange={onSelectChange(onAssign)} />
      <Table>
        <thead>
          <tr>
            <td>Questionnaires</td>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </Table>
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

