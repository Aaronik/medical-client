import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select, { ValueType } from 'react-select'
import { TUser } from 'types/User.d'
import strings from './PatientPicker.strings'
import Avatar from 'components/Avatar'
import FormInput from 'components/FormInput'
import preventDefault from 'util/preventDefault'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHashtag, faAt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { useSetActivePatient } from 'util/hooks'
import { useMutation, gql } from '@apollo/client'
import { Spinner } from 'react-bootstrap'

// This component lives in the top left on the top of the left gutter nav.
// It is what allows doctors to choose the active patient

type TProps = {
  patients: TUser[]
  className?: string
  activePatient?: TUser | null
}

const PatientPicker: React.FC<TProps> = ({ patients, className, activePatient }) => {

  const [ isAddPatientModalActive, setIsAddPatientModalActive ] = useState(false)
  const [ setActivePatient ] = useSetActivePatient()
  const [ invitePatient, { data: inviteData, loading: inviteLoading, error: inviteError }] = useMutation(INVITE_PATIENT, { onError: console.error })

  // For the dropdown, let's sort the patients alphabetically for ease of finding.
  // The Avatar list will be sorted by the server, hopefully by frequency of use.
  const alphabeticallySortedPatientOptions = mapPatientsToOptions(patients).sort((a, b) => a.label[0] < b.label[0] ? -1 : 1)

  const onAvatarClick = ({ id }: { id: number }) => () => {
    // If we're going from user to user, stay on the same page.
    // But if we're going from no user to a user, redir to that user's overview.
    if (!activePatient) setActivePatient(id, '/overview')
    else                setActivePatient(id)
  }

  const onSelectChange = (option: ValueType<TOption>) => {
    if (option) onAvatarClick({ id: (option as TOption).value })()
    else        setActivePatient(0, '/')
  }

  const onAddPatient = async (name: string, phone: string, email: string) => {
    invitePatient({ variables: { name, phone, email, role: 'PATIENT' }})
    setIsAddPatientModalActive(false)
  }

  const addPatientButtonText = inviteLoading ? <Spinner animation='grow'/> : strings('addNewPatient')

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
      <Row className='mt-3 ml-1 align-items-center'>
        <Button variant='link' onClick={() => setIsAddPatientModalActive(true)}>{addPatientButtonText}</Button>
        { inviteData?.sendInvite && <FontAwesomeIcon icon={faCheckCircle} className='icon text-success' size='lg'/> }
        <p className='text-danger'>{inviteError && inviteError.message}</p>
      </Row>
      <AddPatientModal
        show={isAddPatientModalActive}
        onComplete={onAddPatient}
        onHide={() => setIsAddPatientModalActive(false)}
        />
    </Container>
  )
}

export default PatientPicker

type TOption = { value: number, label: string }

type AddPatientModalProps = {
  show: boolean
  onHide: () => void
  onComplete: (name: string, phone: string, email: string) => void
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ show, onHide, onComplete }) => {
  const [ name, setName ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ error, setError ] = useState('')

  const _onComplete = () => {
    if (!phone.length && !email.length) return setError('Please provide at least phone or email.')

    setError('')
    setName('')
    setPhone('')
    setEmail('')
    onComplete(name, phone, email)
  }

  return (
    <Modal show={show} onHide={onHide} >
      <Modal.Header><h2>{strings('addPatientModalHeader')}</h2></Modal.Header>
      <Modal.Body>
        <Form onSubmit={preventDefault}>
          <FormInput
            autoFocus={true}
            label={strings('name')}
            type="text"
            icon={faUser}
            value={name}
            onChange={setName}/>
          <FormInput
            autoFocus={false}
            label={strings('email')}
            type='email'
            icon={faAt}
            value={email}
            onChange={setEmail}/>
          <FormInput
            autoFocus={false}
            label={strings('phone')}
            type='tel'
            icon={faHashtag}
            value={phone}
            onChange={setPhone}/>
          <p className='text-danger'>{error}</p>
          <Button type='submit' onClick={_onComplete}>{strings('addPatient')}</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

const mapPatientsToOptions = (patients: TUser[]): TOption[] => patients.map(mapPatientToOption)

const mapPatientToOption = (patient: TUser): TOption => (
  { value: patient.id, label: patient.name || patient.id.toString()}
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

const INVITE_PATIENT = gql`
  mutation SendInvite($name:String, $email:String, $phone:String, $role:Role!) {
    sendInvite(name:$name, email:$email, phone:$phone, role:$role)
  }
`
