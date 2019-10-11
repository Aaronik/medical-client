import React from 'react'
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

const SignInToSeeDashboardComponent = () => {
  return (
    <Container>
      <Row className='justify-content-around p-5'>
        <h1>Please Sign In to see Doctor Dashboard.</h1>
      </Row>
      <Row className="p-b5">
      </Row>
    </Container>
  )
}

type TProps = {
  isSignedIn: boolean
  patients: TUser[]
  history: RouteComponentProps["history"]
}

type TState = {
  isAddPatientActive: boolean
}

class DoctorDashboard extends React.Component<TProps, TState> {

  state = {
    isAddPatientActive: false
  }

  private onAddPatientButtonClick = () => {
    this.setState({
      isAddPatientActive: !this.state.isAddPatientActive
    })
  }

  private onAddPatientFormComplete = (resp: TSurveyResult) => {
    console.log('onAddPatientFormComplete, resp:', resp)
    addPatient(resp)
    this.setState({ isAddPatientActive: false })
  }

  private get patientTableBody() {
    const bodyContents = this.props.patients.map(patient => {

      const onClick = () => {
        this.props.history.push('/patients/' + patient.id)
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

  render() {
    const { props, state } = this

    if (!props.isSignedIn) return <SignInToSeeDashboardComponent/>

    const addPatientFormClassName = state.isAddPatientActive ? "" : "d-none"
    const patientTableClassName   = state.isAddPatientActive ? "d-none" : ""

    return (
      <Container>
        <Row className='justify-content-around p-5'>
          <h1>Welcome back, Doctor.</h1>
        </Row>
        <Row className="p-b5">
          <Button variant="primary" size="lg" block onClick={this.onAddPatientButtonClick}>
            Add New Patient
          </Button>
        </Row>
        <Row className={addPatientFormClassName}>
          <AddPatientForm onComplete={this.onAddPatientFormComplete}/>
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
            { this.patientTableBody }
          </Table>
        </Row>
      </Container>
    )
  }
}

export default connect((storeState: TStoreState, dispatchProps: RouteComponentProps<{ patientId: string }>): TProps => {
  return {
    isSignedIn: isSignedIn(),
    patients: Object.values(storeState.user.patients),
    history: dispatchProps.history
  }
})(DoctorDashboard)
