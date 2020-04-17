import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Loading from 'pages/Loading'
import ErrorPage from 'pages/Error'
import { GET_QUESTIONNAIRES_ASSIGNED_TO_ME } from 'util/queries'
import { useQuery } from '@apollo/client'
import { TQuestionnaire } from 'types/Questionnaire.d'
import Questionnaire from 'components/Questionnaire'
import { getQuestionnaireCompletionStatusIcon } from 'util/getQuestionnaireCompletionStatus'

const PatientQuestionnaires: React.FunctionComponent = () => {
  const { data, loading, error } = useQuery<{ questionnairesAssignedToMe: TQuestionnaire[] }>(GET_QUESTIONNAIRES_ASSIGNED_TO_ME)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>

  const questionnaires = data?.questionnairesAssignedToMe

  if (!questionnaires?.length) return <h2>No questionnaires!</h2>

  const rows = questionnaires.map(q => {
    const completionIcon = getQuestionnaireCompletionStatusIcon(q)

    return (
      <Row className='d-flex flex-row justify-content-between align-items-center' key={q.id}>
        <Questionnaire
          questionnaire={q}
          isAnswerable={true}
          className='flex-grow-1 mr-4'
          questionResponseRefetchQuery={GET_QUESTIONNAIRES_ASSIGNED_TO_ME}
        />
        {completionIcon}
      </Row>
    )
  })


  return (
    <Container>
      <h1>Patient Questionnaires</h1>
      <hr/>
      { rows }
    </Container>
  )
}

export default PatientQuestionnaires

