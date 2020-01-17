import React from 'react'
import { connect } from 'react-redux'

type TProps = {

}

const DoctorSchedule: React.FC<TProps> = () => {
  return (
    <h1>DoctorSchedule</h1>
  )
}

export default connect(() => {
  return {}
})(DoctorSchedule)

