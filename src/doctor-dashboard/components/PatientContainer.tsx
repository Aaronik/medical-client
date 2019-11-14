import React, { useState } from 'react'
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
import { addTimelineItem, updateTimelineItem } from 'timeline/actions'
import formatDate from 'util/date-to-timeline-date'
import strings from 'common/strings'
import 'doctor-dashboard/styles/patient-container.sass'

// This is used as a temporary filler until the user edits/adds a new event.
const stubTimelineItem: TTimelineItem = {
  start: '10-10-10',
  content: '',
  id: '1'
}

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
  const [ filterString, setFilterString ] = useState('')
  const [ activeGroupIds, setActiveGroupIds ] = useState<string[]>(patientTimelineGroups.map(g => g.id.toString()))

  // store whatever event is being updated / created by the user
  const [ activeTimelineItem, setActiveTimelineItem ] = useState(stubTimelineItem)

  const updateActiveTimelineItem = (update: Partial<TTimelineItem>) => {
    setActiveTimelineItem({ ...activeTimelineItem, ...update })
  }

  const onTimelineDoubleClick = (item: TTimelineItem) => {
    // we'll default to a point event, and user can change to range if desired,
    // or if the item is already a range.
    if (item.end) item.end = formatDate(item.end)
    else item.end = formatDate(item.start)

    item.start = formatDate(item.start)

    setActiveTimelineItem(item)
    setIsModalActive(true)
  }

  const onModalSaveClick = () => {
    const type = activeTimelineItem.end === activeTimelineItem.start ? 'point' as 'point' : 'range' as 'range'
    const item = { ...activeTimelineItem, type }
    const isExistingItem = patientTimelineData.map(d => d.id).includes(activeTimelineItem.id)

    if (isExistingItem) updateTimelineItem(patient.id, item)
    else addTimelineItem(patient.id, item)


    setIsModalActive(false)
  }

  const onFilterInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(changeEvent.currentTarget.value)
  }

  // Until the user tries to update or add a new event, there won't be an activeTimelineItem
  const endDate = activeTimelineItem.end ? activeTimelineItem.end.toString() : activeTimelineItem.start.toString()

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
        onAdd={onTimelineDoubleClick}
        onUpdate={onTimelineDoubleClick}
      />

      <Modal show={isModalActive} centered>
        <Modal.Header>
          <Modal.Title>{strings('addPatientEvent')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormInput label={strings('eventDesc')} value={activeTimelineItem.content} type="text" onChange={content => updateActiveTimelineItem({ content })}/>
            <FormInput label={strings('formStartDate')} value={activeTimelineItem.start.toString()} type="text" onChange={start => updateActiveTimelineItem({ start })}/>
            <FormInput label={strings('formEndDate')} value={endDate} type="text" onChange={end => updateActiveTimelineItem({ end })}/>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalActive(false)}>{strings('close')}</Button>
          <Button variant="primary" onClick={() => onModalSaveClick()}>{strings('save')}</Button>
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
