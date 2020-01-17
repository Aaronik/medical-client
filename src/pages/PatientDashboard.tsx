import React from 'react'
import Container from 'react-bootstrap/Container'
import strings from './PatientDashboard.strings'

const PatientDashboard: React.FunctionComponent = () => {
  return (
    <Container>
      <h1>{strings('patientDashboard')}</h1>
    </Container>
  )
}

export default PatientDashboard
