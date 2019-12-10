import React from 'react'
import { connect } from 'react-redux'

type TProps = {

}

const DoctorOverview: React.FC<TProps> = () => {
  return (
    <h1>DoctorOverview</h1>
  )
}

export default connect(() => {
  return {}
})(DoctorOverview)

