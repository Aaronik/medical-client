import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { connect } from 'react-redux'
import { logout } from 'auth/actions'
import { TUser } from 'user/types.d'

import { TStoreState } from 'store'

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

  return (
    <NavDropdown drop="left" id="auth-dropdown" title="Profile">
      <NavDropdown.Header>{headerText()}</NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Item onClick={onLogoutPress}>Sign Out</NavDropdown.Item>
    </NavDropdown>
  )
}

export default withRouter(connect((storeState: TStoreState, dispatchProps: RouteComponentProps) => {
  return {
    ...dispatchProps,
    user: storeState.user.users[storeState.auth.userUrn]
  }
})(LoginDropdown))
