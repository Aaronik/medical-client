import React from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import * as actions from '../actions'

import { TStoreState } from '../../store'

type TProps = {
  auth: any
}

class LoginContainer extends React.Component<TProps, {}> {
  // TODO @Aaron, @Bow - make this a practice if no extra logic is needed before
  // calling the action, just directly assign instead of being verbose and wrapping.
  private onButtonPress = actions.loginWhatever
  private onLogOutPress = actions.logoutWhatever

  render() {
    return (
      <div>
        <Button onClick={this.onButtonPress}>LOG IN BUBBA</Button>
        <span>&nbsp;</span>
        <Button onClick={this.onLogOutPress}>LOG OUT BUBBA</Button>
        <h1>Data:</h1>
        <pre style={{border: 'solid 1px'}}>{JSON.stringify(this.props.auth, null, 2)}</pre>
      </div>
    )
  }
}

export default connect((storeState: TStoreState) => {
  return { auth: storeState.auth }
})(LoginContainer)
