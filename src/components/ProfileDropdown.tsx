import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { Link, useHistory } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { TUser, TUserRole } from 'types/User.d'
import strings from './ProfileDropdown.strings'

const SIGN_OUT = gql`
  mutation {
    deauthenticate
  }
`

const UPDATE_ROLE = gql`
  mutation UpdateMe($user: MeInput) {
    updateMe(user: $user) {
      role
    }
  }
`

interface IProps {
  user?: TUser
}

const ProfileDropdown: React.FunctionComponent<IProps> = ({ user }) => {

  const history = useHistory()

  const [ signout, { loading, client }] = useMutation(SIGN_OUT, { onError: console.error })
  const [ updateRole ] = useMutation(UPDATE_ROLE, { onError: console.error })

  const onSignoutPress = async () => {
    if (!user) return
    signout()
    localStorage.clear()
    client?.resetStore()
    history.push('/')
  }

  const headerText = () => {
    if (!user) return ""
    const { name, role } = user
    return `${name} (${role})`
  }

  const changeRole = (role: TUserRole) => {
    if (!user) return
    const updatedUser = Object.assign({}, user, { role })
    const key = 'User:' + user.id
    client?.writeData({ data: { [key]: updatedUser }})
    updateRole({ variables: {user: { role }}})
    history.push('/')
  }

  const onMakeAdminClick = () => changeRole('ADMIN')
  const onMakeDoctorClick = () => changeRole('DOCTOR')
  const onMakePatientClick = () => changeRole('PATIENT')

  return (
    <NavDropdown drop="left" id="auth-dropdown" title="Profile">
      <NavDropdown.Header>{headerText()}</NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item as={Link} to="/profile">{strings('profile')}</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Item onClick={onSignoutPress}>{
        loading ? <Spinner animation='grow'/> : strings('signOut')
      }</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Header><Button variant="danger" onClick={onMakeAdminClick}>Make Me an Admin!</Button></NavDropdown.Header>
      <NavDropdown.Header><Button variant="primary" onClick={onMakeDoctorClick}>Make Me a Doctor!</Button></NavDropdown.Header>
      <NavDropdown.Header><Button variant="info" onClick={onMakePatientClick}>Make Me a Patient!</Button></NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item target="_blank" href="https://millihealth.com">{strings('about')}</NavDropdown.Item>
    </NavDropdown>
  )
}

export default ProfileDropdown
