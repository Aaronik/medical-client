import React from 'react'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import UpdateCard, { TProps as UpdateCardProps } from 'common/components/UpdateCard'
import Avatar from 'common/components/Avatar'
import { activePatient } from 'common/util/users'
import strings from './DoctorOverview.strings'
import { TUser } from 'concerns/user/User.d'
import store from 'common/store'
import currentUser from 'common/util/currentUser'
import moment from 'moment'

type TProps = {
  patient: TUser
}

// temporary page data until we have real data
const updates: UpdateCardProps[]  = [
  { symbol: 'up', charge: 'bad', body: '11', footer: strings('alertsDetected') },
  { symbol: 'up', charge: 'good', body: '89%', footer: strings('milliHealthScore') },
  { symbol: 'up', charge: 'bad', body: '8', footer: strings('dystfunctionsIdentified') },
  { symbol: 'up', charge: 'neutral', body: '12', footer: strings('interventionRecommendations') },
]

type Message = {
  id: string
  senderId: string
  receiverId: string
  message: string
  date: string
}

const messages: Message[] = [
  { id: '1', senderId: 'urn:milli:milliUser:200069880266371072', receiverId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the first message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '2', receiverId: 'urn:milli:milliUser:200069880266371072', senderId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the second message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '3', senderId: 'urn:milli:milliUser:200069880266371072', receiverId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the first message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '4', receiverId: 'urn:milli:milliUser:200069880266371072', senderId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the second message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '5', senderId: 'urn:milli:milliUser:200069880266371072', receiverId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the first message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '6', receiverId: 'urn:milli:milliUser:200069880266371072', senderId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the second message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '7', senderId: 'urn:milli:milliUser:200069880266371072', receiverId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the first message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' },
  { id: '8', receiverId: 'urn:milli:milliUser:200069880266371072', senderId: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9', message: 'This is the second message', date: 'Tue 07 Jan 2020 01:18:11 PM PST' }
]

const Message: React.FC<{ message: Message }> = ({ message }) => {
  const sender = store.getState().user.users[message.senderId]

  if (!sender) return <Spinner animation='border'/>

  const isMyMessage = sender.id === currentUser().id

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
      <Avatar user={sender}/>
      <Col className='m-2'>
        <p className={messageClassName + ' p-2'} style={messageStyle}>{message.message}</p>
        <small>{moment(message.date).fromNow()}</small>
      </Col>
    </Row>
  )
}

const MessageBox: React.FC<{ messages: Message[], className?: string }> = ({ messages }) => {
  return (
    <div className='bg-white p-2' style={{ maxHeight: '350px', overflowY: 'auto', borderRadius: '20px' }}>
      { messages.map(m => <Message key={m.id} message={m}/>) }
    </div>
  )
}

const DoctorOverview: React.FC<TProps> = ({ patient }) => {
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
        <MessageBox messages={messages}/>
      </Row>

    </Container>
  )
}

export default connect(() => {
  const ap = activePatient()

  if (!ap) throw new Error('No active patient selected!')

  return { patient: ap }
})(DoctorOverview)

