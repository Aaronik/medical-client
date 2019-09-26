import React from 'react'
import { Alert as RBAlert } from 'react-bootstrap'
import { connect } from 'react-redux'

import { TStoreState, TError } from '../../store'
import * as actions from '../actions'

type TProps = {
  errors: TError[]
}

const Alert = (props: TProps) => (
  <div>
    {
      props.errors.map(e => (
        <RBAlert dismissible onClose={() => actions.clearError(e.id)}variant="danger" key={e.id}>{e.message}</RBAlert>
      ))
    }
  </div>
)

export default connect((storeState: TStoreState) => {
  return { errors: storeState.errors }
})(Alert)
