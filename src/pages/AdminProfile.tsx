import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { TUser } from 'types/User.d'
import strings from './AdminProfile.strings'
import UserInformationUpdateForm from 'components/UserInformationUpdateForm'

interface IProps {
  user: TUser
}

const DoctorProfile: React.FunctionComponent<IProps> = ({ user }) => {

  return (
    <Container fluid className='bg-white with-background'>
      <Container>
        <UserInformationUpdateForm user={user}/>
      </Container>
    </Container>
  )
}

export default DoctorProfile


