import React, { useState } from 'react'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import FormInput from 'common/components/form-input'
import { TStoreState } from 'store'
import { TUser } from 'user/types.d'
import Timeline from 'timeline/components'
import { TTimelineItem, TTimelineGroup } from 'timeline/types.d'
import { addTimelineItem } from 'timeline/actions'
import formatDate from 'util/date-to-timeline-date'
import strings from 'common/strings'

type TProps = {
  patient: TUser
  patientTimelineData: TTimelineItem[]
  patientTimelineGroups: TTimelineGroup[]
}

const PatientContainer: React.FC<TProps> = ({ patient, patientTimelineData, patientTimelineGroups }) => {
  const [ isModalActive, setIsModalActive ] = useState(false)
  const [ description, setDescription ] = useState('')
  const [ startDate, setStartDate ] = useState('')
  const [ endDate, setEndDate ] = useState('')

  const onTimelineDoubleClick = (item: TTimelineItem) => {
    setIsModalActive(true)
    setStartDate(formatDate(item.start))
    setEndDate(formatDate(item.start))
  }

  const onAddTimelineItem = () => {
    const type = endDate === startDate ? 'point' : 'range'

    addTimelineItem(patient.id, {
      id: uuid(),
      content: description,
      group: 1,
      type: type,
      start: startDate,
      end: endDate
    })

    setDescription('')
    setStartDate('')
    setEndDate('')
    setIsModalActive(false)
  }

  return (
    <Container>

      <Row className="justify-content-around p-5">
        <h1>{strings('yourPatient', patient.name)}</h1>
      </Row>

      <Timeline data={patientTimelineData} groups={patientTimelineGroups} onAdd={onTimelineDoubleClick}/>

      <Modal show={isModalActive} centered>
        <Modal.Header>
          <Modal.Title>{strings('addPatientEvent')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormInput label={strings('eventDesc')} value={description} type="text" onChange={setDescription}/>
            <FormInput label={strings('formStartDate')} value={startDate} type="text" onChange={setStartDate}/>
            <FormInput label={strings('formEndDate')} value={endDate} type="text" onChange={setEndDate}/>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalActive(false)}>{strings('close')}</Button>
          <Button variant="primary" onClick={() => onAddTimelineItem()}>{strings('save')}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default connect((storeState: TStoreState, dispatchProps: { match: { params: { patientId: string }}}): TProps => {
  const patientId = dispatchProps.match.params.patientId

  return {
    patient: storeState.user.users[patientId],
    patientTimelineData: storeState.timeline[patientId].items || [],
    patientTimelineGroups: storeState.timeline[patientId].groups || []
  }
})(PatientContainer)
