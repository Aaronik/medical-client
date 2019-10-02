import React from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { connect } from 'react-redux'
import { authenticate, logout } from 'auth/actions'
import { fetchUser } from 'user/actions'
import { TBranchState as TAuthState } from 'auth/types.d'
import { TBranchState as TUserState } from 'user/types.d'

import { TStoreState } from 'store'

type TProps = {
  auth: TAuthState
  user: TUserState
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
    const { name, userName } = this.props.user
    if (!name) return "You hain't signed in and fethed the user yet"
    return `${name} (${userName})`
  }

  get isSignedIn(): boolean {
    return !!this.props.auth.sessionToken
  }

  render() {
    return (
      <NavDropdown drop="left" id="auth-dropdown" title="Profile">
        <NavDropdown.Header>{this.headerText}</NavDropdown.Header>
        <NavDropdown.Divider/>
        <NavDropdown.Item disabled={this.isSignedIn} onClick={this.onAuthenticateClick}>Sign In</NavDropdown.Item>
        <NavDropdown.Item disabled={!this.isSignedIn} onClick={this.onLogoutPress}>Sign Out</NavDropdown.Item>
        <NavDropdown.Divider/>
        <NavDropdown.Item onClick={this.fetchUser}>Fetch Signed In User</NavDropdown.Item>
      </NavDropdown>
    )
  }
}

export default connect((storeState: TStoreState) => {
  return { auth: storeState.auth, user: storeState.user }
})(LoginDropdown)
