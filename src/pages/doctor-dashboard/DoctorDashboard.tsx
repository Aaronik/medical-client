import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import Button from 'react-bootstrap/Button'
import Avatar from 'common/components/Avatar'
import { connect } from 'react-redux'
import { TStoreState } from 'common/store'
import { patients } from 'common/util/users'
import currentUser from 'common/util/currentUser'
import { TUser } from 'concerns/user/User.d'
import { TNotification } from 'concerns/notification/Notification.d'
import formatDate from 'common/util/formatDate'
import { setActiveUser } from 'concerns/user/User.actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import strings from './DoctorDashboard.strings'

interface TProps {
  patients: TUser[]
  currentUser: TUser
  notifications: TNotification[]
}

const NumberBadge: React.FC<{ bg: string }> = ({ bg, children }) => {
  const style = {
    width: '50px',
    borderRadius: '20px',
  } as const

  return <div style={style} className={'p-3 m-2 text-center bg-' + bg}>{children}</div>
}

const PatientCard: React.FC<{ patient: TUser }> = ({ patient }) => {
  const { name, birthday, joinDate, lastVisit, adherence } = patient

  const containerStyle = {
    cursor: 'pointer',
    borderRadius: '20px',
    width: '350px',
  } as const

  return (
    <div style={containerStyle} className='bg-white p-3 m-3' onClick={() => setActiveUser(patient.id)}>

      <Row className='justify-content-center mb-5'>
        <div className='flex-column'>
          <Avatar user={patient} size={80} />
          <div>{name}</div>
          <div className='text-muted text-center'>{birthday ? formatDate(birthday) : strings('na')}</div>
        </div>
      </Row>

      <Row>
          <Col>
            <div className='text-muted badge'>{strings('joined')}</div>
            <div className='text-center font-weight-bolder'>{ joinDate ? formatDate(joinDate) : strings('na')}</div>
          </Col>

          <Col>
            <div className='text-muted badge'>{strings('lastVisit')}</div>
            <div className='text-center font-weight-bolder'>{lastVisit ? formatDate(lastVisit) : strings('na')}</div>
          </Col>

          <Col>
            <div className='text-muted badge'>{strings('adherence')}</div>
            <div className='text-center font-weight-bolder'>{adherence ? `${adherence}%` : strings('na')}</div>
          </Col>
      </Row>

      <Row className='justify-content-around'>
        <NumberBadge bg='danger'>11</NumberBadge>
        <NumberBadge bg='success'>89</NumberBadge>
        <NumberBadge bg='pink'>1</NumberBadge>
        <NumberBadge bg='warning'>12</NumberBadge>
      </Row>

    </div>
  )
}

const UpdateCard: React.FC<{ symbol: 'up' | 'down' | 'neutral', body: string, footer: string }> = ({ symbol, body, footer }) => {
  let indicatorColor: 'success' | 'pink' | 'warning' = 'success'
  let icon: typeof icons.faArrowUp | typeof icons.faArrowDown | typeof icons.faMinus = icons.faArrowUp

  if (symbol === 'down') {
    indicatorColor = 'pink'
    icon = icons.faArrowDown
  }

  if (symbol === 'neutral') {
    indicatorColor = 'warning'
    icon = icons.faMinus
  }

  const cardStyle = {
    width: '250px',
    height: '125px',
    borderRadius: '15px',
  } as const

  const indicatorStyle = {
    marginTop: '-25px', // randomly found to bring it up enough
    borderRadius: '20px',
    width: '60px',
    height: '60px',
  } as const

  return (
    <div style={cardStyle} className='bg-white m-5 d-flex flex-column align-items-center justify-content-around'>

      <div className={'d-flex align-items-center justify-content-center mx-auto bg-' + indicatorColor} style={indicatorStyle}>
        <FontAwesomeIcon icon={icon} size='lg'/>
      </div>

      <h3>{body}</h3>

      <p className='text-muted'>{footer}</p>
    </div>
  )
}

const DoctorDashboard: React.FunctionComponent<TProps> = ({ patients, currentUser, notifications }) => {

  return (
    <Container fluid>
      <Row className='p-5'>
        <Col xs={2}>
          <img alt='milli bot' className='d-none d-xl-block' src='/millibot.png'/>
        </Col>
        <Col xs={10}>
          <div>
            <h1>{strings('welcomeBackDoctor', currentUser && currentUser.name, notifications.length)}</h1>
            <Row>
              <UpdateCard symbol='up' body='85%' footer={strings('avgHealthScore')} />
              <UpdateCard symbol='down' body='12' footer={strings('dystfunctionsIdentified')} />
              <UpdateCard symbol='neutral' body='15' footer={strings('interventionRecommendations')} />
            </Row>
          </div>
        </Col>
      </Row>
      <br/>
      <h3>{strings('patientList')}</h3>
      <Row className=''>
        { patients.map(p => <PatientCard key={p.id} patient={p}/>)}
      </Row>
    </Container>
  )
}

export default connect((storeState: TStoreState): TProps => {
  return {
    patients: patients(),
    currentUser: currentUser(),
    notifications: storeState.notifications.notifications,
  }
})(DoctorDashboard)
