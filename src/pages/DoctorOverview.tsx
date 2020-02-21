import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import UpdateCard, { TProps as UpdateCardProps } from 'components/UpdateCard'
import Avatar from 'components/Avatar'
import { TUser } from 'types/User.d'
import moment from 'moment'

type TProps = {
  user: TUser
  patient: TUser
  messages: Message[]
  updates: UpdateCardProps[]
}

type Message = {
  id: string
  sender: TUser
  message: string
  date: Date
}

const DoctorOverview: React.FC<TProps> = ({ patient, user, updates, messages }) => {
  return (
    <Container fluid className='m-2'>

      <Row>
        <h1>{patient.name}</h1>
      </Row>

      <Row className='mt-4'>
        { updates.map(u => <UpdateCard key={u.footer} className='m-4' {...u} />)}
      </Row>

      <Row className='mt-4 d-flex justify-content-around'>
        <big>Chart thing</big>
        <MessageBox messages={messages} user={user}/>
      </Row>

    </Container>
  )
}

const Message: React.FC<{ message: Message, user: TUser }> = ({ message, user }) => {
  const isMyMessage = message.sender.id === user.id

  let rowClassName = isMyMessage ? '' : 'flex-row-reverse'
  rowClassName += ' m-2'

  const messageBorderRadius = '12px'

  const messageStyle = {
    marginBottom: 0,
    borderRadius: messageBorderRadius,
    borderTopLeftRadius: isMyMessage ? 0 : messageBorderRadius,
    borderTopRightRadius: isMyMessage ? messageBorderRadius : 0,
  }

  let messageClassName = isMyMessage ? 'bg-primary' : 'bg-light'

  return (
    <Row className={rowClassName}>
      <Avatar user={message.sender}/>
      <Col className='m-2'>
        <p className={messageClassName + ' p-2'} style={messageStyle}>{message.message}</p>
        <small>{moment(message.date).fromNow()}</small>
      </Col>
    </Row>
  )
}

const MessageBox: React.FC<{ messages: Message[], user: TUser, className?: string }> = ({ messages, user }) => {
  return (
    <div className='bg-white p-2' style={{ maxHeight: '350px', overflowY: 'auto', borderRadius: '20px' }}>
      { messages.map(m => <Message key={m.id} message={m} user={user}/>) }
    </div>
  )
}

export default DoctorOverview
