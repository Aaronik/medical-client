import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Loading from 'pages/Loading'
import { GET_ALL_QUESTIONNAIRES } from 'util/queries'
import { useQuery } from '@apollo/client'
import { TQuestionnaire } from 'types/Questionnaire.d'

const PatientQuestionnaires: React.FunctionComponent = () => {
  const { data, loading, error } = useQuery(GET_ALL_QUESTIONNAIRES)

  if (loading) return <Loading/>
  if (error) return <code>{JSON.stringify(error, null, 2)}</code>

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

type QuestionnaireProps = {
  questionnaire: TQuestionnaire
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questionnaire }) => {

  const [ isExpanded, setIsExpanded ] = useState(false)

  const containerStyle = {
    border: '1px solid black',
    margin: '2px',
    padding: '5px',
    cursor: 'pointer',
  }

  if (!isExpanded) return (
    <div style={containerStyle} onClick={() => setIsExpanded(true)}>
      <h2>{questionnaire.title}</h2>
    </div>
  )

  return (
    <div style={containerStyle} onClick={() => setIsExpanded(false)}>
      <h2>{questionnaire.title}</h2>
      <code>{JSON.stringify(questionnaire)}</code>
    </div>
  )
}
