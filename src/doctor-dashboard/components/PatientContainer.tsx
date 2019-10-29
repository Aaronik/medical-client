import React from 'react'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { TStoreState } from 'store'
import { TUser } from 'user/types.d'
import AddPatientEventForm, { TSurveyResult } from 'doctor-dashboard/components/AddPatientEventForm'
import Timeline from 'timeline/components'
import { TTimelineDatum, TTimelineGroup } from 'timeline/types.d'
import { addTimelineData } from 'timeline/actions'

type TProps = {
  patient: TUser
  patientTimelineData: TTimelineDatum[]
  patientTimelineGroups: TTimelineGroup[]
}

type TState = {}

class PatientContainer extends React.Component<TProps, TState> {
  private onAddPatientEventComplete = (res: TSurveyResult) => {
    const patientId = this.props.patient.id

    const data: TTimelineDatum[] = res.events.map(event => {
      return {
        start: event.date,
        id: uuid(),
        content: event.description
      }
    })

    addTimelineData(patientId, data)
  }

  render() {
    const { patient, patientTimelineData, patientTimelineGroups } = this.props

    return (
      <Container>
        <Row className="justify-content-around p-5">
          <h1>Your Patient: {patient.name}</h1>
        </Row>
        <Timeline data={patientTimelineData} groups={patientTimelineGroups} />
        <AddPatientEventForm onComplete={this.onAddPatientEventComplete} />
      </Container>
    )
  }
}

export default connect((storeState: TStoreState, dispatchProps: { match: { params: { patientId: string }}}): TProps => {
  const patientId = dispatchProps.match.params.patientId

  return {
    patient: storeState.user.users[patientId],
    patientTimelineData: storeState.timeline[patientId].items || [],
    patientTimelineGroups: storeState.timeline[patientId].groups || []
  }
})(PatientContainer)
