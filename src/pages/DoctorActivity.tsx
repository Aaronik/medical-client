import React from 'react'
import { connect } from 'react-redux'

type TProps = {

}

const DoctorActivity: React.FC<TProps> = () => {
  return (
    <h1>DoctorActivity</h1>
  )
}

export default connect(() => {
  return {}
})(DoctorActivity)
