import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { TUser } from 'types/User.d'
import strings from './AdminDashboard.strings'

interface IProps {
  doctors: TUser[]
  user: TUser
  invitationLoading: boolean
}

const DEFAULT_MESSAGE = strings('invitationDefaultMessage')

const AdminDashboard: React.FunctionComponent<IProps> = ({ user, doctors, invitationLoading }) => {

  const [ email, setEmail ] = useState('')
  const [ message, setMessage ] = useState(DEFAULT_MESSAGE)

  const onInvite = () => {
    alert('Sorry, user invitations have been temporarily disabled. (TODO)')
    // TODO temporarily disabled
    return ({
      message, email,
      senderId: user.id,
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
        <h1>{strings('welcomeBack', user.name)}</h1>
      </Row>

      <hr/>

      <Row className='pt-5'>
        <h3>{strings('inviteDoc')}</h3>
      </Row>

      <Form className='pt-3'>
        <Form.Group>
          <Form.Label>{strings('emailAddress')}</Form.Label>
          <Form.Control onChange={onEmailChange} size="lg" type="email" required placeholder={strings('emailPlaceholder')} />
        </Form.Group>
        <Form.Group>
          <Form.Label>{strings('message')}</Form.Label>
          <Form.Control onChange={onMessageChange} size="lg" as="textarea" rows="3" placeholder={DEFAULT_MESSAGE}/>
        </Form.Group>

        <Button
          block
          size="lg"
          onClick={onInvite}
          disabled={!email || invitationLoading}
          variant="success">
          { invitationLoading ? <Spinner animation="grow" /> : strings('sendInvite') }
        </Button>

      </Form>
    </Container>
  )
}

export default AdminDashboard
