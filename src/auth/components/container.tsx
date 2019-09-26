import React from 'react'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as T from '../types.d'

import { TStoreState } from '../../store'

type TProps = {
  auth: T.TBranchState
}

class LoginContainer extends React.Component<TProps, {}> {
  private onLoadHostMapClick() {
    actions.loadHostMap()
  }

  private onAuthenticateClick() {
    actions.authenticate('boomama', '11111')
  }

  private onLogoutPress() {
    actions.logout()
  }

  private fetchUser() {
    actions.fetchUser()
  }

  render() {
    return (
      <Container>
        <ButtonToolbar>
          <ButtonGroup>
            <Button variant="success" onClick={this.onLoadHostMapClick}>Load Host Map</Button>
            <Button variant="secondary" onClick={this.onAuthenticateClick}>Authenticate</Button>
            <Button variant="primary" onClick={this.onLogoutPress}>Log Out</Button>
          </ButtonGroup>
          <Button variant="info" onClick={this.fetchUser}>Fetch User</Button>
        </ButtonToolbar>
        <h1>Data:</h1>
        <pre style={{border: 'solid 1px'}}>{JSON.stringify(this.props.auth, null, 2)}</pre>
      </Container>
    )
  }
}

export default connect((storeState: TStoreState) => {
  return { auth: storeState.auth }
})(LoginContainer)
