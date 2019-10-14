import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { connect } from 'react-redux'
import { logout } from 'auth/actions'
import { fetchUser } from 'user/actions'
import { TUser } from 'user/types.d'

import { TStoreState } from 'store'

interface IProps extends RouteComponentProps {
  isSignedIn: boolean
  user: TUser
}

const LoginDropdown: React.FunctionComponent<IProps> = ({ user, isSignedIn, history }) => {

  const onSignInClick = () => {
    history.push('/signin')
  }

  const onLogoutPress = () => {
    logout()
  }

  const headerText = () => {
    if (!user) return "You hain't signed in and fetched the user yet"
    const { name, userName } = user
    return `${name} (${userName})`
  }

  return (
    <NavDropdown drop="left" id="auth-dropdown" title="Profile">
      <NavDropdown.Header>{headerText()}</NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item disabled={isSignedIn} onClick={onSignInClick}>Sign In</NavDropdown.Item>
      <NavDropdown.Item disabled={!isSignedIn} onClick={onLogoutPress}>Sign Out</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Item onClick={() => fetchUser()}>Fetch Signed In User</NavDropdown.Item>
    </NavDropdown>
  )
}

export default withRouter(connect((storeState: TStoreState) => {
  return {
    isSignedIn: !!storeState.auth.sessionToken,
    user: storeState.user.users[storeState.auth.userUrn]
  }
})(LoginDropdown))
