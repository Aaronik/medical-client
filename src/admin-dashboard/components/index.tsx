import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { doctors, currentUser, TStoreState } from 'store'
import { TUser } from 'user/types.d'
import { inviteUser } from 'user/actions'

interface IProps extends RouteComponentProps {
  doctors: TUser[]
  user: TUser
  invitationLoading: boolean
}

const DEFAULT_MESSAGE = "I'd like to invite you to join Milli!"

const AdminDashboard: React.FunctionComponent<IProps> = ({ user, history, doctors, invitationLoading }) => {

  const [ email, setEmail ] = useState('')
  const [ message, setMessage ] = useState(DEFAULT_MESSAGE)

  const onInvite = () => {
    inviteUser({
      message, email,
      senderId: currentUser().id,
    })
  }

  const onEmailChange = (e: any) => {
    const value = e.currentTarget.value
    setEmail(value)
  }

  const onMessageChange = (e: any) => {
    const value = e.currentTarget.value
    setMessage(value)
  }

  return (
    <Container>
      <Row className='justify-content-around pt-5'>
        <h1>Welcome back, { user.name }</h1>
      </Row>

      <hr/>

      <Row className='pt-5'>
        <h3>Invite A Doctor to Milli:</h3>
      </Row>

      <Form className='pt-3'>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control onChange={onEmailChange} size="lg" type="email" required placeholder="name@example.com" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control onChange={onMessageChange} size="lg" as="textarea" rows="3" placeholder={DEFAULT_MESSAGE}/>
        </Form.Group>

        <Button
          block
          size="lg"
          onClick={onInvite}
          disabled={!email || invitationLoading}
          variant="success">
          { invitationLoading ? <Spinner animation="grow" /> : "Send the invite!" }
        </Button>

      </Form>

      <hr className='mt-5'/>

      <Row className='pt-5'>
        <h3>Doctors in the system:</h3>
      </Row>

      <ListGroup className='pt-3'>
        <ListGroup.Item action>Doc 1</ListGroup.Item>
        <ListGroup.Item action>Doc 2</ListGroup.Item>
        <ListGroup.Item action>Doc 3</ListGroup.Item>
      </ListGroup>
    </Container>
  )
}

export default connect((storeState: TStoreState) => {
  return {
    doctors: doctors(),
    user: currentUser(),
    invitationLoading: storeState.user.invitationLoading
  }
})(AdminDashboard)
