import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { Alert as RBAlert } from 'react-bootstrap'
import * as T from 'types/Alert.d'

type TProps = {
  alerts: T.TAlert[]
}

const CLEAR_ALERT = gql`
  mutation ClearAlert($id: String!) {
    clearAlert(id: $id)
  }
`

const Alert = (props: TProps) => {
  const [ clearAlert ] = useMutation(CLEAR_ALERT)

  return (
    <div className='position-absolute w-100 p-1 z-9999'>
      {
        props.alerts.map(e => (
          <RBAlert dismissible onClose={() => clearAlert({ variables: { id: e.id }})} variant={e.type} key={e.id}>{e.message}</RBAlert>
        ))
      }
    </div>
  )
}

export default Alert
