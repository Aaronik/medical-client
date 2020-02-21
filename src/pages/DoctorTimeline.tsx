import React, { useState, useEffect } from 'react'
import { without } from 'lodash'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Form from 'react-bootstrap/Form'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import * as icons from '@fortawesome/free-solid-svg-icons'
import Select, { ValueType } from 'react-select'

import FormInput from 'components/FormInput'
import preventDefault from 'util/preventDefault'
import DatePickerModal from 'components/DatePickerModal'
import { TUser } from 'types/User.d'
import Timeline from 'components/Timeline'
import { TTimelineItem, TTimelineGroup } from 'types/Timeline.d'
import { TimelineItem as VisTimelineItem } from 'vis-timeline'
import formatDate from 'util/formatDate'
import strings from './DoctorTimeline.strings'
import './DoctorTimelinne.sass'
import onSelectChange, { TOption } from 'util/onSelectChange'

type TProps = {
  patient: TUser
  patientTimelineData: TTimelineItem[]
  patientTimelineGroups: TTimelineGroup[]
}

const DoctorTimelinePage: React.FC<TProps> = ({ patient, patientTimelineData, patientTimelineGroups }) => {
  const [ isEventModalActive, setIsEventModalActive ] = useState(false)
  const [ filterString, setFilterString ] = useState('')
  const [ activeGroupIds, setActiveGroupIds ] = useState<string[]>(mapGroupsToIds(patientTimelineGroups))

  // store whatever event is being updated / created by the user
  const [ activeTimelineItem, setActiveTimelineItem ] = useState(stubTimelineItem)

  // When doctor switches b/t patients, we need to reinitialize the selected groups state
  useEffect(() => {
    setActiveGroupIds(mapGroupsToIds(patientTimelineGroups))
  }, [patientTimelineGroups])

  const updateActiveTimelineItem = (update: Partial<TTimelineItem>) => {
    setActiveTimelineItem({ ...activeTimelineItem, ...update })
  }

  const onTimelineDoubleClick = (item: VisTimelineItem) => {
    // we'll default to a point event, and user can change to range if desired,
    // or if the item is already a range.
    if (!item.end) item.end = item.start

    setActiveTimelineItem(item)
    setIsEventModalActive(true)
  }

  const onMoveItemInTimeline = (item: VisTimelineItem) => {
    alert('Sorry, item updating/adding has been temporarily disabled (TODO)')
    /* updateTimelineItem(patient.id, item) */
  }

  const onModalSaveClick = () => {
    const type = activeTimelineItem.end === activeTimelineItem.start ? 'point' as 'point' : 'range' as 'range'
    const item = { ...activeTimelineItem, type }
    const isExistingItem = patientTimelineData.map(d => d.id).includes(activeTimelineItem.id)

    alert('Sorry, item updating/adding has been temporarily disabled (TODO)')
    /* if (isExistingItem) updateTimelineItem(patient.id, item) */
    /* else addTimelineItem(patient.id, item) */

    setIsEventModalActive(false)
  }

  const onFilterInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(changeEvent.currentTarget.value)
  }

  return (
    <Container fluid className='doctor-dashboard-patient-container'>

      <Row className='justify-content-around py-5'>
        <Col xs={12} lg={4}>
          <h1>{strings('yourPatient', patient.name)}</h1>
        </Col>

        <Col xs={12} lg={8}>
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
        </Col>
      </Row>


      <Timeline
        items={filterTimelineData(filterString, patientTimelineData)}
        groups={filterTimelineGroups(activeGroupIds, patientTimelineGroups)}
        onAdd={onTimelineDoubleClick}
        onUpdate={onTimelineDoubleClick}
        onMove={onMoveItemInTimeline} />

      <EventModal
        show={isEventModalActive}
        item={activeTimelineItem}
        updateItem={updateActiveTimelineItem}
        onSave={onModalSaveClick}
        groups={patientTimelineGroups}
        onClose={() => setIsEventModalActive(false)} />

    </Container>
  )
}

// This is used as a temporary filler until the user edits/adds a new event.
const stubTimelineItem: TTimelineItem = {
  start: '10-10-10',
  content: '',
  id: '1',
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
  groups: TTimelineGroup[]
  onSave: () => void
  onClose: () => void
  updateItem: (update: Partial<TTimelineItem>) => void
}

const EventModal: React.FC<TEventModalProps> = ({ show, item, onSave, updateItem, onClose, groups }) => {
  const [ isStartDateModalActive, setIsStartDateModalActive ] = useState(false)
  const [ isEndDateModalActive, setIsEndDateModalActive ] = useState(false)

  const isNewItem = item.content === 'new item'

  const endDate = item.end ? item.end : item.start

  const groupOptions: TOption[] = groups.map(g => (
    { value: g.id, label: g.content }
  ))

  const activeGroup = groups.find(g => {
    return item.group === g.id
  })

  const groupContent = activeGroup ? activeGroup.content : ''
  const groupName = typeof groupContent === 'string' ? groupContent : groupContent.innerHTML

  return (
    <React.Fragment>
      <DatePickerModal
        show={isStartDateModalActive}
        initialDate={new Date(item.start)}
        onClose={() => setIsStartDateModalActive(false)}
        onSelect={date => updateItem({ start: date })} />

      <DatePickerModal
        show={isEndDateModalActive}
        initialDate={new Date(item.end || "")}
        onClose={() => setIsEndDateModalActive(false)}
        onSelect={date => updateItem({ end: date })} />

      <Modal show={show} centered onHide={onClose}>
        <Modal.Header>
          <Modal.Title>{isNewItem ? strings('addPatientEvent') : strings('updatePatientEvent')}</Modal.Title>
        </Modal.Header>

        <Form onSubmit={preventDefault}>

          <Modal.Body>
            <Form.Label className='text-muted'>{strings('category')}</Form.Label>
            <Select
              className='pb-3'
              onChange={onSelectChange((group: string) => updateItem({ group }))}
              defaultInputValue={groupName}
              options={groupOptions}/>

            <FormInput
              autoFocus={true}
              label={strings('eventDesc')}
              value={item.content}
              type="text"
              onChange={content => updateItem({ content })}/>
            <FormInput
              label={strings('formStartDate')}
              value={formatDate(item.start)}
              type="text"
              icon={icons.faCalendarAlt}
              onIconClick={() => setIsStartDateModalActive(true)}
              onChange={start => updateItem({ start })}/>
            <FormInput
              label={strings('formEndDate')}
              value={formatDate(endDate)}
              icon={icons.faCalendarAlt}
              onIconClick={() => setIsEndDateModalActive(true)}
              type="text"
              onChange={end => updateItem({ end })}/>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>{strings('close')}</Button>
            <Button type='submit' variant="primary" onClick={onSave}>{strings('save')}</Button>
          </Modal.Footer>

        </Form>

      </Modal>
    </React.Fragment>
  )
}

const mapGroupsToIds = (groups: TTimelineGroup[]) => groups.map(g => g.id.toString())

export default DoctorTimelinePage
