import React from 'react'
import Container from 'react-bootstrap/Container'
import Loading from 'pages/Loading'
import ErrorPage from 'pages/Error'
import { GET_ALL_QUESTIONNAIRES } from 'util/queries'
import { useQuery } from '@apollo/client'
import { TQuestionnaire } from 'types/Questionnaire.d'
import Questionnaire from 'components/Questionnaire'

const PatientQuestionnaires: React.FunctionComponent = () => {
  const { data, loading, error } = useQuery(GET_ALL_QUESTIONNAIRES)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>

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

