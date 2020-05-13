import React, { useState } from 'react'
import { TUser } from 'types/User.d'
import FormInput from 'components/FormInput'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import onKeyDown from 'util/onKeyDown'
import { UPDATE_ME, ME_QUERY } from 'util/queries'
import { useMutation } from '@apollo/client'

type TProps = {
  user: TUser
}

type UserKey = Partial<keyof TUser>

const CompleteInformationPage: React.FC<TProps> = ({ user }) => {
  const requisiteUser = REQUIRED_FIELDS.reduce((u, key) => {
    // @ts-ignore
    u[key] = user[key]
    return u
  }, {} as Partial<TUser>)

  const [ userData, setUserData ] = useState(requisiteUser)

  const [ updateMe, { loading, error }] = useMutation(UPDATE_ME, {
    onError: console.error,
    refetchQueries: [{ query: ME_QUERY }]
  })

  const yetIncompleteFields = REQUIRED_FIELDS.map(field => {
    if (!user[field]) return field
    return false
  }).filter(Boolean) as UserKey[]

  const inputs = yetIncompleteFields.map(field => {
    return (
      <SingleFormInput
        key={field}
        field={field}
        onChange={val => setUserData(Object.assign({}, userData, {[field]: val}))}
        value={userData[field]?.toString() || ''}/>
    )
  })

  const onSubmit = () => {
    updateMe({ variables: { user: userData }})
  }

  return (
    <Container onKeyDown={onKeyDown('Enter', onSubmit)}>
      <Modal show={true} className='mt-5'>
        <Modal.Header className='d-flex flex-column'>
          <h3>Before you login</h3>
          <p>Please complete the following information:</p>
        </Modal.Header>
        <Modal.Body>
          {inputs}
        </Modal.Body>
        <Modal.Footer>
          <p className='text-danger'>{error?.message}</p>
          { loading ? <Spinner animation='grow'/> : <Button onClick={onSubmit}>OK</Button> }
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default CompleteInformationPage

const REQUIRED_FIELDS: UserKey[] = ['email', 'phone', 'name']

type SingleFormInputProps = {
  field: UserKey
  onChange: (val: string) => void
  value: string
}

const SingleFormInput: React.FC<SingleFormInputProps> = ({ field, onChange, value }) => {
  let type = 'text' as 'email' | 'tel' | 'text'

  if (field === 'email') type = 'email' as const
  if (field === 'phone') type = 'tel' as const

  let label = ''

  if (field === 'email') label = 'Email:'
  if (field === 'phone') label = 'Phone number:'
  if (field === 'name') label = 'Full name:'

  return (
    <FormInput
      key={field}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
    />
  )
}
