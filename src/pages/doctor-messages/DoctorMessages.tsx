import React from 'react'
import { connect } from 'react-redux'

type TProps = {

}

const DoctorMessages: React.FC<TProps> = () => {
  return (
    <h1>DoctorMessages</h1>
  )
}

export default connect(() => {
  return {}
})(DoctorMessages)

