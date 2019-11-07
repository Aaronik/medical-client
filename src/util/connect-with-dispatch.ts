import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { TStoreState } from 'store'

// The purpose of this utility is to abstract a common connect which only returned
// the dispatchProps. This was born of a flag in code climate. It may be unnecessary
// abstraction but for the time being it has to exist. If this is not being used,
// please do delete it.
const connectWithDispatch = (Component: React.ComponentType<any>) => (
  connect((storeState: TStoreState, dispatchProps: RouteComponentProps) => {
    return dispatchProps
  })(Component)
)

export default connectWithDispatch
