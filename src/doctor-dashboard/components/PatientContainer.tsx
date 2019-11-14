import React, { useState } from 'react'
import uuid from 'uuid/v4'
import { without } from 'lodash'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Form from 'react-bootstrap/Form'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import FormInput from 'common/components/form-input'
import { TStoreState } from 'store'
import { TUser } from 'user/types.d'
import Timeline from 'timeline/components'
import { TTimelineItem, TTimelineGroup } from 'timeline/types.d'
import { addTimelineItem } from 'timeline/actions'
import formatDate from 'util/date-to-timeline-date'
import strings from 'common/strings'
import 'doctor-dashboard/styles/patient-container.sass'

type TGroupSelectProps = {
  groups: TTimelineGroup[]
  activeGroupIds: string[]
  onChange: Function
}

const GroupSelect: React.FC<TGroupSelectProps> = ({ groups, activeGroupIds, onChange }) => {

  const onDropdownChange = (e: React.SyntheticEvent) => {
    const id = (e.target as HTMLInputElement).id.toString()

    if (activeGroupIds.includes(id)) {
      // user is toggling this id on
      onChange(without(activeGroupIds, id))
    } else {
      // user is toggling this id off
      onChange(activeGroupIds.concat([id]))
    }
  }

  const dropdownItems = groups.map(group => (
      <Dropdown.Item
        key={group.id}
        as={Form.Check} >

        <Form.Check
          type="checkbox"
          custom
          defaultChecked={true}
          id={group.id.toString()}
          label={group.content}/>

      </Dropdown.Item>
  ))

  return (
    <DropdownButton
      className='ml-3'
      id="patient-container-group-filter-dropdown"
      drop="down"
      variant="secondary"
      onChange={onDropdownChange}
      title={strings('groupFilterLabel')}>

      {dropdownItems}
    </DropdownButton>
  )
}

const filterTimelineData = (filterString: string, data: TTimelineItem[]): TTimelineItem[] => (
  data.filter(item => item.content.toLowerCase().includes(filterString))
)

const filterTimelineGroups = (groupIds: string[], groups: TTimelineGroup[]): TTimelineGroup[] => (
  groups.filter(group => groupIds.includes(group.id.toString()))
)

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
  const [ filterString, setFilterString ] = useState('')
  const [ activeGroupIds, setActiveGroupIds ] = useState<string[]>(patientTimelineGroups.map(g => g.id.toString()))

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

  const onFilterInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(changeEvent.currentTarget.value)
  }

  return (
    <Container fluid className='doctor-dashboard-patient-container'>

      <Row className="justify-content-around p-5">
        <h1>{strings('yourPatient', patient.name)}</h1>

        <ButtonToolbar className='align-items-center'>
          <input
            className="font-weight-bold"
            value={filterString}
            onChange={onFilterInputChange}
            placeholder={strings('searchFilterPlaceholder')} />

          <GroupSelect
            activeGroupIds={activeGroupIds}
            onChange={setActiveGroupIds}
            groups={patientTimelineGroups} />

        </ButtonToolbar>

      </Row>


      <Timeline
        data={filterTimelineData(filterString, patientTimelineData)}
        groups={filterTimelineGroups(activeGroupIds, patientTimelineGroups)}
        onAdd={onTimelineDoubleClick}/>

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
