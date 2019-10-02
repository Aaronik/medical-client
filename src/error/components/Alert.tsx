import React from 'react'
import { Alert as RBAlert } from 'react-bootstrap'
import { connect } from 'react-redux'

import { TStoreState } from 'store'
import * as actions from 'error/actions'
import * as T from 'error/types.d'

type TProps = {
  errors: T.TError[]
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
