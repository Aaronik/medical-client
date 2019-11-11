import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { connect } from 'react-redux'
import { TStoreState, patients } from 'store'
import { TUser } from 'user/types.d'
import AddPatientForm, { TSurveyResult } from 'doctor-dashboard/components/AddPatientForm'
import { addPatient } from 'user/actions'
import strings from 'common/strings'

interface TProps extends RouteComponentProps {
  patients: TUser[]
}

const DoctorDashboard: React.FunctionComponent<TProps> = ({ patients, history }) => {

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

      const onClick = () => {
        history.push('/patients/' + patient.id)
      }

      return (
        <tr key={patient.id} onClick={onClick}>
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

export default connect((storeState: TStoreState, dispatchProps: RouteComponentProps<{ patientId: string }>): TProps => {
  return {
    ...dispatchProps,
    patients: patients()
  }
})(DoctorDashboard)
