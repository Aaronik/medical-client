import React from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { connect } from 'react-redux'
import { authenticate, logout } from 'auth/actions'
import { fetchUser } from 'user/actions'
import { TUser } from 'user/types.d'

import { TStoreState } from 'store'

type TProps = {
  isSignedIn: boolean
  user: TUser
}

class LoginDropdown extends React.Component<TProps, {}> {
  private onAuthenticateClick() {
    authenticate('boomama', '11111')
  }

  private onLogoutPress() {
    logout()
  }

  private fetchUser() {
    fetchUser()
  }

  get headerText() {
    if (!this.props.user) return "You hain't signed in and fetched the user yet"
    const { name, userName } = this.props.user
    return `${name} (${userName})`
  }

  render() {
    return (
      <NavDropdown drop="left" id="auth-dropdown" title="Profile">
        <NavDropdown.Header>{this.headerText}</NavDropdown.Header>
        <NavDropdown.Divider/>
        <NavDropdown.Item disabled={this.props.isSignedIn} onClick={this.onAuthenticateClick}>Sign In</NavDropdown.Item>
        <NavDropdown.Item disabled={!this.props.isSignedIn} onClick={this.onLogoutPress}>Sign Out</NavDropdown.Item>
        <NavDropdown.Divider/>
        <NavDropdown.Item onClick={this.fetchUser}>Fetch Signed In User</NavDropdown.Item>
      </NavDropdown>
    )
  }
}

export default connect((storeState: TStoreState) => {
  return {
    isSignedIn: !!storeState.auth.sessionToken,
    user: storeState.user.users[storeState.auth.userUrn]
  }
})(LoginDropdown)
