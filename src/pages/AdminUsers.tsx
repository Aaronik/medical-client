import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { USERS } from 'util/queries'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Loading from 'pages/Loading'
import { TUser } from 'types/User.d'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'

type TProps = {

}

const AdminUsersPage: React.FC<TProps> = () => {

  const { data, error, loading } = useQuery<{ users: TUser[]}>(USERS)
  const [ associate ] = useMutation(ASSOCIATE, { refetchQueries: [{ query: USERS }]})
  const [ unassociate ] = useMutation(UNASSOCIATE, { refetchQueries: [{ query: USERS }]})

  const [ isAssociateModalOpen, setIsAssociateModalOpen ] = useState(false)
  const [ doctorId, setDoctorId ] = useState(0)
  const [ patientId, setPatientId ] = useState(0)

  if (loading) return <Loading/>
  if (error) return <code>{JSON.stringify(error, null, 2)}</code>

  const users = data?.users || []

  const userOptions = users.map(user => {
    return { value: user.id, label: user.name }
  })

  const onAssociateClick = () => {
    associate({ variables: { doctorId, patientId }})
    setIsAssociateModalOpen(false)
  }

  const onPatientNameClick = (patientId: number, doctorId: number) => () => {
    unassociate({ variables: { doctorId, patientId }})
  }

  return (
    <Container>
      <Row className='d-flex flex-row justify-content-between m-3'>
        <h1>Users</h1>
        <Button onClick={() => setIsAssociateModalOpen(true)} variant='success'>Associate</Button>
      </Row>
      <Table variant='primary' striped={true}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Last Visit</th>
            <th>Patients</th>
            <th>Doctors</th>
          </tr>
        </thead>
        <tbody>
          { users.map(user => {
            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{prettyDate(user.joinDate)}</td>
                <td>{prettyDate(user.lastVisit)}</td>
                <td>{user.patients?.map(p => <p key={p.id} onClick={onPatientNameClick(p.id, user.id)}>{p.name}</p>)}</td>
                <td>{user.doctors?.map(d => <p key={d.id} onClick={onPatientNameClick(user.id, d.id)}>{d.name}</p>)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Modal show={isAssociateModalOpen} centered onHide={() => setIsAssociateModalOpen(false)}>
        <Modal.Header><h3>Create a Doctor/Patient Association</h3></Modal.Header>
        <Modal.Body>

          <Form.Label>Doctor</Form.Label>
          <Select
            className='pb-3'
            label='Doctor'
            onChange={onSelectChange(setDoctorId)}
            options={userOptions}/>

          <Form.Label>Patient</Form.Label>
          <Select
            className='pb-3'
            label='Patient'
            onChange={onSelectChange(setPatientId)}
            options={userOptions}/>

        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setIsAssociateModalOpen(false)}>Close</Button>
          <Button onClick={onAssociateClick}>Associate</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  )
}

export default AdminUsersPage

const prettyDate = (dateString?: string) => (new Date(Number(dateString))).toLocaleString()

const ASSOCIATE = gql`
  mutation Associate($patientId: Int!, $doctorId: Int!) {
    assignPatientToDoctor(patientId: $patientId, doctorId: $doctorId)
  }
`
const UNASSOCIATE = gql`
  mutation Unassociate($patientId: Int!, $doctorId: Int!) {
    unassignPatientFromDoctor(patientId: $patientId, doctorId: $doctorId)
  }
`



