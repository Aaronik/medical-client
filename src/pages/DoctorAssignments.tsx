import { gql, useQuery } from '@apollo/client'
import ErrorPage from 'pages/Error'
import LoadingPage from 'pages/Loading'
import React from 'react'
import Container from 'react-bootstrap/Container'

type TProps = {

}

const DoctorAssignmentsPage: React.FC<TProps> = () => {
  const { data, loading, error } = useQuery(MY_QUESTIONNAIRE_ASSIGNMENTS)

  if (loading) return <LoadingPage/>
  if (error) return <ErrorPage error={error}/>

  return (
    <Container>
      {JSON.stringify(data)}
    </Container>
  )
}

export default DoctorAssignmentsPage

const MY_QUESTIONNAIRE_ASSIGNMENTS = gql`
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

