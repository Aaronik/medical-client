import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { logout } from 'auth/actions'
import { makeMeAdmin, makeMeDoctor, makeMePatient } from 'user/actions'
import { TUser } from 'user/types.d'
import { TStoreState } from 'store'
import strings from 'common/strings'

interface IProps extends RouteComponentProps {
  user: TUser
}

const LoginDropdown: React.FunctionComponent<IProps> = ({ user, history }) => {

  const onLogoutPress = () => {
    logout()
    history.push('/')
  }

  const headerText = () => {
    if (!user) return ""
    const { name, userName } = user
    return `${name} (${userName})`
  }

  const onMakeAdminClick = () => {
    makeMeAdmin()
    history.push('/')
  }

  const onMakeDoctorClick = () => {
    makeMeDoctor()
    history.push('/')
  }

  const onMakePatientClick = () => {
    makeMePatient()
    history.push('/')
  }

  return (
    <NavDropdown drop="left" id="auth-dropdown" title="Profile">
      <NavDropdown.Header>{headerText()}</NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item as={Link} to="/profile">{strings('profile')}</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Item onClick={onLogoutPress}>{strings('signOut')}</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Header><Button variant="danger" onClick={onMakeAdminClick}>Make Me an Admin!</Button></NavDropdown.Header>
      <NavDropdown.Header><Button variant="primary" onClick={onMakeDoctorClick}>Make Me a Doctor!</Button></NavDropdown.Header>
      <NavDropdown.Header><Button variant="info" onClick={onMakePatientClick}>Make Me a Patient!</Button></NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item target="_blank" href="https://millihealth.com">{strings('about')}</NavDropdown.Item>
    </NavDropdown>
  )
}

export default withRouter(connect((storeState: TStoreState, dispatchProps: RouteComponentProps) => {
  return {
    ...dispatchProps,
    user: storeState.user.users[storeState.auth.userUrn]
  }
})(LoginDropdown))
