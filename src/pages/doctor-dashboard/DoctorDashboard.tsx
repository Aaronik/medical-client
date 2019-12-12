import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { connect } from 'react-redux'
import { TStoreState } from 'common/store'
import { patients } from 'common/util/users'
import { TUser } from 'concerns/user/User.d'
import { setActiveUser } from 'concerns/user/User.actions'
import strings from './DoctorDashboard.strings'

interface TProps {
  patients: TUser[]
}

const DoctorDashboard: React.FunctionComponent<TProps> = ({ patients }) => {

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

  return (
    <Container>
      <Row className='justify-content-around p-5'>
        <h1>{strings('welcomeBackDoctor')}</h1>
      </Row>
      <Row className="p-b5">
      </Row>
      <br/>
      <Row>
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
