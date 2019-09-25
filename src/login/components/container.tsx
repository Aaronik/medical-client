import React from 'react'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import { connect } from 'react-redux'
import * as actions from '../actions'

import { TStoreState } from '../../store'

type TProps = {
  auth: any
}

class LoginContainer extends React.Component<TProps, {}> {
  private onLoadHostMapClick() {
    actions.loadHostMap()
  }

  private onGetTokenClick() {
    actions.getToken()
  }

  private onAuthenticateClick() {
    actions.authenticate('boomama', '11111')
  }

  private onLogoutPress() {
    actions.logout()
  }

  render() {
    return (
      <Container>
        <ButtonToolbar>
          <ButtonGroup>
            <Button variant="success" onClick={this.onLoadHostMapClick}>Load Host Map</Button>
            <Button variant="info" onClick={this.onGetTokenClick}>Get Token</Button>
            <Button variant="secondary" onClick={this.onGetTokenClick}>Authenticate</Button>
            <Button variant="primary" onClick={this.onLogoutPress}>Log Out</Button>
          </ButtonGroup>
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
