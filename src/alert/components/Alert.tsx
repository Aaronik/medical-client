import React from 'react'
import { Alert as RBAlert } from 'react-bootstrap'
import { connect } from 'react-redux'

import { TStoreState } from 'store'
import * as actions from 'alert/actions'
import * as T from 'alert/types.d'

type TProps = {
  alerts: T.TAlert[]
}

const Alert = (props: TProps) => {
  return (
    <div>
      {
        props.alerts.map(e => (
          <RBAlert dismissible onClose={() => actions.clearAlert(e.id)} variant={e.type} key={e.id}>{e.message}</RBAlert>
        ))
      }
    </div>
  )
}

export default connect((storeState: TStoreState) => {
  return { alerts: storeState.alerts }
})(Alert)
