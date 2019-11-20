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
import * as icons from '@fortawesome/free-solid-svg-icons'

import FormInput from 'common/components/FormInput'
import DatePickerModal from 'common/components/DatePickerModal'
import { TStoreState } from 'common/store'
import { TUser } from 'concerns/user/User.d'
import Timeline from 'applets/timeline/Timeline'
import { TTimelineItem, TTimelineGroup } from 'applets/timeline/Timeline.d'
import { addTimelineItem, updateTimelineItem } from 'applets/timeline/Timeline.actions'
import formatDate from 'common/util/dateToTimelineDate'
import strings from './PatientPage.strings'
import './PatientPage.sass'

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
  className?: string
}

const GroupSelect: React.FC<TGroupSelectProps> = ({ groups, activeGroupIds, onChange, className }) => {

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
      className={className + ' border rounded-lg'}
      id="patient-container-group-filter-dropdown"
      drop="down"
      variant="white"
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
  // We have to, in lieu of simply filtering out the undesired groups, assign them a property visible: false
  // or else the timeline throws some async errors that can't even be caught with an error boundary.
  // As such, the name of this function is a little deceiptful, but since it still performs basically
  // the same end result, I'm leaving it as is.
  groups.map(group => groupIds.includes(group.id.toString()) ? group : { ...group, visible: false })
)

type TEventModalProps = {
  show: boolean
  item: TTimelineItem
  onSave: () => void
  onClose: () => void
  updateItem: (update: Partial<TTimelineItem>) => void
}

const EventModal: React.FC<TEventModalProps> = ({ show, item, onSave, updateItem, onClose }) => {
  const [ isStartDateModalActive, setIsStartDateModalActive ] = useState(false)
  const [ isEndDateModalActive, setIsEndDateModalActive ] = useState(false)

  const endDate = item.end ? item.end.toString() : item.start.toString()

  return (
    <React.Fragment>
      <DatePickerModal
        show={isStartDateModalActive}
        initialDate={new Date(item.start)}
        onClose={() => setIsStartDateModalActive(false)}
        onSelect={date => updateItem({ start: formatDate(date) })} />

      <DatePickerModal
        show={isEndDateModalActive}
        initialDate={new Date(item.end || "")}
        onClose={() => setIsEndDateModalActive(false)}
        onSelect={date => updateItem({ end: formatDate(date) })} />

      <Modal show={show} centered onHide={onClose}>
        <Modal.Header>
          <Modal.Title>{strings('addPatientEvent')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormInput
              label={strings('eventDesc')}
              value={item.content}
              type="text"
              onChange={content => updateItem({ content })}/>
            <FormInput
              label={strings('formStartDate')}
              value={item.start.toString()}
              type="text"
              icon={icons.faCalendarAlt}
              onIconClick={() => setIsStartDateModalActive(true)}
              onChange={start => updateItem({ start })}/>
            <FormInput
              label={strings('formEndDate')}
              value={endDate}
              icon={icons.faCalendarAlt}
              onIconClick={() => setIsEndDateModalActive(true)}
              type="text"
              onChange={end => updateItem({ end })}/>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>{strings('close')}</Button>
          <Button variant="primary" onClick={onSave}>{strings('save')}</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

type TProps = {
  patient?: TUser // patient will not be present if user nav'ed to unpresent patient id
  patientTimelineData: TTimelineItem[]
  patientTimelineGroups: TTimelineGroup[]
}

const PatientContainer: React.FC<TProps> = ({ patient, patientTimelineData, patientTimelineGroups }) => {
  const [ isEventModalActive, setIsEventModalActive ] = useState(false)
  const [ filterString, setFilterString ] = useState('')
  const [ activeGroupIds, setActiveGroupIds ] = useState<string[]>(patientTimelineGroups.map(g => g.id.toString()))

  // store whatever event is being updated / created by the user
  const [ activeTimelineItem, setActiveTimelineItem ] = useState(stubTimelineItem)

  if (!patient) return <h1>{strings('patientNotFound')}</h1>

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
    setIsEventModalActive(true)
  }

  const onMoveItemInTimeline = (item: TTimelineItem) => {
    item.start = formatDate(item.start)
    if (item.end) item.end = formatDate(item.end)

    updateTimelineItem(patient.id, item)
  }

  const onModalSaveClick = () => {
    const type = activeTimelineItem.end === activeTimelineItem.start ? 'point' as 'point' : 'range' as 'range'
    const item = { ...activeTimelineItem, type }
    const isExistingItem = patientTimelineData.map(d => d.id).includes(activeTimelineItem.id)

    if (isExistingItem) updateTimelineItem(patient.id, item)
    else addTimelineItem(patient.id, item)

    setIsEventModalActive(false)
  }

  const onFilterInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(changeEvent.currentTarget.value)
  }

  return (
    <Container fluid className='doctor-dashboard-patient-container'>

      <Row className="justify-content-around p-5">
        <h1>{strings('yourPatient', patient.name)}</h1>

        <ButtonToolbar className='align-items-center'>

          <GroupSelect
            className="mr-3"
            activeGroupIds={activeGroupIds}
            onChange={setActiveGroupIds}
            groups={patientTimelineGroups} />

          <input
            className="ml-5"
            value={filterString}
            onChange={onFilterInputChange}
            placeholder={strings('searchFilterPlaceholder')} />

        </ButtonToolbar>

      </Row>


      <Timeline
        items={filterTimelineData(filterString, patientTimelineData)}
        groups={filterTimelineGroups(activeGroupIds, patientTimelineGroups)}
        onAdd={onTimelineDoubleClick}
        onUpdate={onTimelineDoubleClick}
        onMove={onMoveItemInTimeline}
      />

      <EventModal
        show={isEventModalActive}
        item={activeTimelineItem}
        updateItem={updateActiveTimelineItem}
        onSave={onModalSaveClick}
        onClose={() => setIsEventModalActive(false)} />

    </Container>
  )
}

export default connect((storeState: TStoreState, dispatchProps: { match: { params: { patientId: string }}}): TProps => {
  const patientId = dispatchProps.match.params.patientId
  const patientTimeline = storeState.timeline[patientId]

  return {
    patient: storeState.user.users[patientId],
    patientTimelineData: patientTimeline ? patientTimeline.items : [],
    patientTimelineGroups: patientTimeline ? patientTimeline.groups : []
  }
})(PatientContainer)
