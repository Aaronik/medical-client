import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { connect } from 'react-redux'
import { TStoreState, isSignedIn } from 'store'
import { TUser } from 'user/types.d'
import AddPatientForm, { TSurveyResult } from 'doctor-dashboard/components/AddPatientForm'
import { addPatient } from 'user/actions'

const SignInToSeeDashboardComponent = ({ goToSignIn }: { goToSignIn: () => void }) => {
  return (
    <Container>
      <Row className='justify-content-around p-5'>
        <h1>Please Sign In to see Doctor Dashboard.</h1>
      </Row>
      <Row className="p-b5">
        <Button onClick={goToSignIn} block size="lg">Go To Sign In</Button>
      </Row>
    </Container>
  )
}

interface TProps extends RouteComponentProps {
  isSignedIn: boolean
  patients: TUser[]
}

const DoctorDashboard: React.FunctionComponent<TProps> = ({ isSignedIn, patients, history }) => {

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

  if (!isSignedIn) return <SignInToSeeDashboardComponent goToSignIn={() => history.push('/signin')}/>

  const addPatientFormClassName = isAddPatientActive ? "" : "d-none"
  const patientTableClassName   = isAddPatientActive ? "d-none" : ""

  return (
    <Container>
      <Row className='justify-content-around p-5'>
        <h1>Welcome back, Doctor.</h1>
      </Row>
      <Row className="p-b5">
        <Button variant="primary" size="lg" block onClick={onAddPatientButtonClick}>
          Add New Patient
        </Button>
      </Row>
      <Row className={addPatientFormClassName}>
        <AddPatientForm onComplete={onAddPatientFormComplete}/>
      </Row>
      <br/>
      <Row className={patientTableClassName}>
        <h3>Your patients:</h3>
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
    isSignedIn: isSignedIn(),
    patients: Object.values(storeState.user.patients)
  }
})(DoctorDashboard)
