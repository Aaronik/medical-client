import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { connect } from 'react-redux'
import { logout } from 'auth/actions'
import { TUser } from 'user/types.d'

import { TStoreState } from 'store'

interface IProps extends RouteComponentProps {
  isSignedIn: boolean
  user: TUser
}

const LoginDropdown: React.FunctionComponent<IProps> = ({ user, isSignedIn, history }) => {

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
      { isSignedIn && <NavDropdown.Header>{headerText()}</NavDropdown.Header> }
      { isSignedIn && <NavDropdown.Divider/> }
      { isSignedIn && <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item> }
      { isSignedIn && <NavDropdown.Divider/> }
      <NavDropdown.Item as={Link} to="/signin">Sign In</NavDropdown.Item>
      <NavDropdown.Item disabled={!isSignedIn} onClick={onLogoutPress}>Sign Out</NavDropdown.Item>
    </NavDropdown>
  )
}

export default withRouter(connect((storeState: TStoreState, dispatchProps: RouteComponentProps) => {
  return {
    ...dispatchProps,
    isSignedIn: !!storeState.auth.sessionToken,
    user: storeState.user.users[storeState.auth.userUrn]
  }
})(LoginDropdown))
