import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { connect } from 'react-redux'
import { TStoreState } from 'common/store'
import { patients } from 'common/util/users'
import { TUser } from 'concerns/user/User.d'
import AddPatientForm, { TSurveyResult } from './AddPatientForm'
import { addPatient, setActiveUser } from 'concerns/user/User.actions'
import strings from './DoctorDashboard.strings'

interface TProps {
  patients: TUser[]
}

const DoctorDashboard: React.FunctionComponent<TProps> = ({ patients }) => {

  const [ isAddPatientActive, setIsAddPatientActive ] = useState(false)

  const onAddPatientButtonClick = () => {
    setIsAddPatientActive(!isAddPatientActive)
  }

  const onAddPatientFormComplete = (resp: TSurveyResult) => {
    addPatient(resp)
    setIsAddPatientActive(false)
  }

  const patientTableBody = () => {
    const bodyContents = patients.map(patient => {

      return (
        <tr key={patient.id} onClick={() => setActiveUser(patient.id)}>
          <td>{patient.id}</td>
          <td>{patient.name}</td>
        </tr>
      )
    })

    return (
      <tbody>
        {bodyContents}
      </tbody>
    )
  }

  const addPatientFormClassName = isAddPatientActive ? "" : "d-none"
  const patientTableClassName   = isAddPatientActive ? "d-none" : ""

  return (
    <Container>
      <Row className='justify-content-around p-5'>
        <h1>{strings('welcomeBackDoctor')}</h1>
      </Row>
      <Row className="p-b5">
        <Button variant="primary" size="lg" block onClick={onAddPatientButtonClick}>
          {strings('addNewPatient')}
        </Button>
      </Row>
      <Row className={addPatientFormClassName}>
        <AddPatientForm onComplete={onAddPatientFormComplete}/>
      </Row>
      <br/>
      <Row className={patientTableClassName}>
        <h3>{strings('yourPatients')}</h3>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
            </tr>
          </thead>
          { patientTableBody() }
        </Table>
      </Row>
    </Container>
  )
}

export default connect((storeState: TStoreState): TProps => {
  return {
    patients: patients()
  }
})(DoctorDashboard)
