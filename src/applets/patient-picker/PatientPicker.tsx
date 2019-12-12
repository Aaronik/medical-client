import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select, { ValueType } from 'react-select'
import { TUser } from 'concerns/user/User.d'
import { TStoreState } from 'common/store'
import strings from './PatientPicker.strings'
import { patients } from 'common/util/users'
import Avatar from 'common/components/Avatar'
import FormInput from 'common/components/FormInput'
import { addPatient, setActiveUser } from 'concerns/user/User.actions'
import { faUser } from '@fortawesome/free-solid-svg-icons'

// This component lives in the top left on the top of the left gutter nav.
// It is what allows doctors to chose the active patient

type TProps = {
  patients: TUser[]
  className?: string
  activePatientId: string | false
} & RouteComponentProps

type TOption = { value: string, label: string }

const AddPatientModal: React.FC<{ show: boolean, onHide: () => void, onComplete: (name: string) => void }> = ({ show, onHide, onComplete }) => {
  const [ name, setName ] = useState('')

  const onC = () => {
    setName('')
    onComplete(name)
  }

  return (
    <Modal show={show} onHide={onHide} >
      <Modal.Header><h2>{strings('addPatientModalHeader')}</h2></Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
          <FormInput
            autoFocus={true} // TODO
            label={strings('name')}
            type="text"
            icon={faUser}
            value={name}
            onChange={setName}/>
          <Button onClick={onC}>{strings('addPatient')}</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

const mapPatientsToOptions = (patients: TUser[]): TOption[] => patients.map(mapPatientToOption)

const mapPatientToOption = (patient: TUser): TOption => (
  { value: patient.id, label: patient.name }
)

const formatOptionLabel = (patients: TUser[]) => ({ value, label }: TOption) => {
  const patient = patients.find(p => p.id === value)
  if (!patient) return <span>{strings('patientNotFound')}</span>

  return (
    <div className='d-flex flex-row align-items-center'>
      <Avatar user={patient} size={30}/>
      <span className='pl-2'>{patient.name}</span>
    </div>
  )
}

const _PatientPicker: React.FC<TProps> = ({ patients, className, activePatientId, history }) => {

  const [ isAddPatientModalActive, setIsAddPatientModalActive ] = useState(false)

  const activePatient = patients.find(p => p.id === activePatientId)

  // For the dropdown, let's sort the patients alphabetically for ease of finding.
  // The Avatar list will be sorted by the server, hopefully by frequency of use.
  const alphabeticallySortedPatientOptions = mapPatientsToOptions(patients).sort((a, b) => a.label[0] < b.label[0] ? -1 : 1)

  const onAvatarClick = (patient: TUser) => () => {
    setActiveUser(patient.id)
    history.push('/overview')
  }

  const onSelectChange = (option: ValueType<TOption>) => {
    if (!option) {
      history.push('/')
      return setActiveUser(false)
    }
    // @ts-ignore I don't know how to properly type this, sorry.
    setActiveUser(option.value)
  }

  const onAddPatient = (name: string) => {
    addPatient({ name: { first: name, last: '' }})
    setIsAddPatientModalActive(false)
  }

  return (
    <Container>
      <Select
        isClearable
        className={className}
        onChange={onSelectChange}
        value={activePatient && mapPatientToOption(activePatient)}
        placeholder={strings('selectPatient')}
        formatOptionLabel={formatOptionLabel(patients)}
        options={alphabeticallySortedPatientOptions} />
      <Row className='ml-0 mt-3'>
        { patients.map(p => <Avatar key={p.id} user={p} className='ml-2' onClick={onAvatarClick(p)}/>)}
      </Row>
      <Row className='mt-3 ml-1'>
        <Button variant='link' onClick={() => setIsAddPatientModalActive(true)}>{strings('addNewPatient')}</Button>
      </Row>
      <AddPatientModal
        show={isAddPatientModalActive}
        onComplete={onAddPatient}
        onHide={() => setIsAddPatientModalActive(false)} />
    </Container>
  )
}

const PatientPicker = withRouter(_PatientPicker)

export default connect((storeState: TStoreState) => ({ patients: patients(), activePatientId: storeState.user.activePatientId }))(PatientPicker)
