import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import Button from 'react-bootstrap/Button'
import Avatar from 'components/Avatar'
import UpdateCard from 'components/UpdateCard'
import { TUser } from 'types/User.d'
import { TNotification } from 'types/Notification.d'
/* import formatDate from 'util/formatDate' */
import strings from './DoctorDashboard.strings'
import { useSetActivePatient } from 'util/hooks'

interface TProps {
  patients: TUser[]
  user: TUser
  notifications: TNotification[]
}

const DoctorDashboard: React.FunctionComponent<TProps> = ({ patients, user, notifications }) => {

  return (
    <Container fluid>
      <Row className='p-5'>
        <Col xs={2}>
          <img alt='milli bot' className='d-none d-xl-block' src='/millibot.png'/>
        </Col>
        <Col xs={10}>
          <div>
            <h1>{strings('welcomeBackDoctor', user.name, notifications.length)}</h1>
            <Row>
              <UpdateCard className='m-5' symbol='up' charge='good' body='85%' footer={strings('avgHealthScore')} />
              <UpdateCard className='m-5' symbol='up' charge='bad' body='12' footer={strings('dystfunctionsIdentified')} />
              <UpdateCard className='m-5' symbol='neutral' charge='neutral' body='15' footer={strings('interventionRecommendations')} />
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

const PatientCard: React.FC<{ patient: TUser }> = ({ patient }) => {
  const { name, birthday, joinDate, lastVisit, adherence } = patient

  const [ setActiveP ] = useSetActivePatient()

  const containerStyle = {
    cursor: 'pointer',
    borderRadius: '20px',
    width: '350px',
  } as const

  const onCardClick = () => setActiveP(patient.id, '/overview')

  return (
    <div style={containerStyle} className='bg-white p-3 m-3' onClick={onCardClick}>

      <Row className='justify-content-center mb-5'>
        <div className='flex-column'>
          <Avatar user={patient} size={80} onClick={onCardClick}/>
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
          <div className='text-center font-weight-bolder'>{adherence ? adherence + "%" : strings('na')}</div>
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

const NumberBadge: React.FC<{ bg: string }> = ({ bg, children }) => {
  const style = {
    width: '50px',
    borderRadius: '20px',
  } as const

  return <div style={style} className={'p-3 m-2 text-center bg-' + bg}>{children}</div>
}

const formatDate = (date: Date | number | string) => {
  return (new Date(+date)).toLocaleDateString()
}

export default DoctorDashboard
