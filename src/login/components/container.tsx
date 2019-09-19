import React from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import * as actions from '../actions'

import { TStoreState } from '../../store'

type TProps = {
  auth: any
}

class LoginContainer extends React.Component<TProps, {}> {

  private onButtonPress = () => {
    actions.loginWhatever()
  }

  render() {
    return (
      <div>
        <Button onClick={this.onButtonPress}>Send request</Button>
        <h1>The response:</h1>
        <pre>{JSON.stringify(this.props.auth, null, 2)}</pre>
        <br/><br/><br/>
        <h1>Cookies:</h1>
        <pre>{document.cookie}</pre>
      </div>
    )
  }
}

export default connect((storeState: TStoreState) => {
  return { auth: storeState.auth }
})(LoginContainer)
