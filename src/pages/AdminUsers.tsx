import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { USERS } from 'util/queries'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Loading from 'pages/Loading'
import ErrorPage from 'pages/Error'
import { TUser } from 'types/User.d'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import onKeyDown from 'util/onKeyDown'
import './AdminUsers.sass'

type TProps = {

}

const AdminUsersPage: React.FC<TProps> = () => {

  const { data, error, loading } = useQuery<{ users: TUser[]}>(USERS)
  const mutationOptions = { refetchQueries: [{ query: USERS }], onError: console.error }
  const [ associate, { error: assError, loading: assLoading } ] = useMutation(ASSOCIATE, mutationOptions)
  const [ unassociate, { error: unassError, loading: unassLoading } ] = useMutation(UNASSOCIATE, mutationOptions)

  const [ isAssociateModalOpen, setIsAssociateModalOpen ] = useState(false)
  const [ doctorId, setDoctorId ] = useState(0)
  const [ patientId, setPatientId ] = useState(0)

  if (loading) return <Loading/>
  if (error) return <ErrorPage error={error}/>

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

  const mainButtonContent = (assLoading || unassLoading) ? <Spinner animation='grow'/> : 'Associate'

  return (
    <Container>
      <Row className='d-flex flex-row justify-content-between m-3'>
        <h1>Users</h1>
        <p className='text-danger'>{assError?.message || unassError?.message || ''}</p>
        <Button onClick={() => setIsAssociateModalOpen(true)} variant='success'>{mainButtonContent}</Button>
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
                <td>{user.patients?.map(p => <p key={p.id} className='association-name' onClick={onPatientNameClick(p.id, user.id)}>{p.name}</p>)}</td>
                <td>{user.doctors?.map(d => <p key={d.id} className='association-name' onClick={onPatientNameClick(user.id, d.id)}>{d.name}</p>)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Modal show={isAssociateModalOpen} centered onHide={() => setIsAssociateModalOpen(false)}>
        <Modal.Header><h3>Create a Doctor/Patient Association</h3></Modal.Header>
        <Modal.Body onKeyDown={onKeyDown('Enter', onAssociateClick)}>

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



